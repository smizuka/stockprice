class SimulationsController < ApplicationController

    require 'net/http'
    require 'net/https'
    require 'uri'
    require 'json'
    require 'base64'

    def calc

        # 保有期間
        params['day']
        #銘柄一覧 -> 最新のadjust
        params['codes']
        # ユーザーが選択したリターン・リスクペア
        n=params['select'].to_i-1
        #最適化された保有比率->!! pythonには送信しない !!
        #weghtは[[銘柄数]*5]のリストになっている
        w=params['weight'][n.to_s]
        #標準偏差
        params['sigma']
        #投資予定の金額
        params['price']

        #params["day"]は１つの値しかないので銘柄数と同じになるようにする
        days=[]
        for i in 1..params["codes"].length do
            days.push(params["day"])
        end

        #前日終値を収めるコード
        prices=[]
        params["codes"].each do |code|
            price=Stock.code_index(code).date_desc(1)[0].adjust
            prices.push(price)
        end

        #投資金額＊比率をかけていく
        weighted_prices=[]
        w.each do |w2|
            #投資金額に比率をかけていく
            a=params['price'].to_i*w2.to_f
            weighted_prices.push(a)
        end

        #各銘柄への投資金額/前日調整済終値によって購入株数を出す
        obtain_stocks=[]
        i=0
        weighted_prices.each do |weighted_price|
            #各調整済み株価で投資金額を除する
            b = weighted_price / (prices[i]*100)

            #割り算をしたあとに少数の場合、小数点以上を切り下げる
            obtain_stocks.push(b.floor)
            i+=1
        end

        #APIに送るためにhash形式にする
        datas={"codes": params["codes"],
               "day": days,
               "sigma": params["sigma"],
               "adjust": prices
        }

        uri = URI('https://serene-reaches-83793.herokuapp.com/simulation')
        http = Net::HTTP.new(uri.host, uri.port)

        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE

        req = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')

        req.body = datas.to_json

        res = http.request(req)

        #------------------------ローカルテスト用------------------------
        # uri = URI('http://0.0.0.0:5000/simulation')
        # req = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
        # req.body = datas.to_json
        # res = Net::HTTP.start(uri.hostname, uri.port) do |http|
        #     http.request(req)
        #     http.use_ssl = true if uri.scheme == 'https'
        # end

        #戻ってきたJSONファイルをデコードする
        # 各データの日数分のシミュレーションデータが入っている
        sim_datas = JSON.parse(res.body)

        # 比率を入れていくリスト
        results=[]

        i=0
        params['codes'].each do|code|
            # 各銘柄のシミュレーション結果が入っている
            sim_data=sim_datas[code]
            # puts sim_data
            after=[]
            #シュミレーション結果のデータを１つずつ取り出して比率をかけていく
            sim_data.each do |sim|
                after.push(sim.to_f.round(0)*w[i].to_f)
            end
            i+=1
            # すべての値に比率をかけ終えたデータをリストに入れる
            results.push(after)
        end

        #リストの行数を取得する
        r=results[0].length-1

        #ポートフォリオの予想収益結果を入れるリスト
        return_datas=[]

        for i in 0..r do
            #各銘柄の各行の値にウェイトを乗じて合計したものを一時的に入れる変数
            data=0
            n=0
            results.each do|result|
                data+=result[i]*obtain_stocks[n]*100
                n+=1
            end
            #各行の合計を入れていく
            return_datas.push(data.round(0))
        end

        # 独自に定義した関数
        down_rate=drowdown(return_datas)

        # start_price=0
        # i=0
        # prices.each do |price|
        #     start_price+=price*obtain_stocks[i]*100
        #     i+=1
        # end


        n= return_datas.length-1

        res ={
            "return": return_datas,
            "start": return_datas[0],
            "end": return_datas[n],
            "drowdown": down_rate
        }

        render json: res.to_json

    end


    #配列は古い->新しいというように並んでいることを想定する
    def drowdown(data)
        #最大値を求める
        tmp_max=data.max
        #配列の中での最大値の位置を求める
        tmp_max_idx=data.index(tmp_max)
        #配列の要素数をもとめる（マイナス１するのはあとで長さとして利用するため）
        num=data.length-1
        #最大値のあとから最後まで切り出し
        tmp_array=data.slice(tmp_max_idx,num)
        #最小値を求める
        tmp_min=tmp_array.min
        # 最大値から最小値までの下落率を算出する
        down_rate=(tmp_min.to_f-tmp_max.to_f)/tmp_max.to_f*100

        return down_rate.round(2)
    end

  #平均を計算する関数
  def mean(data)
    num=data.length
    sum=0
    data.each do|d|
      sum+=d.to_f
    end
    total=(sum/num).round(2)
    return total
  end

  #収益率の時系列データを出す関数
  #data: リスト形式の時系列データ(古い->新しいで並んでいる)
  def return_data(data)
    diff=[]
    n=data.length-1
    #差分を取るので最後の１要素は計算しない
    for i in 0..n-1 do
      a=(data[i+1].to_f-data[i].to_f)/data[i].to_f*100
      diff.push(a.round(2))
    end

    return diff
  end

  #標準偏差を計算する関数
  def std(data)
    #meanは独自定義関数
    m=mean(data)
    num=data.length
    var=0
    data.each do |d|
      var+=(d.to_f-m)**2
    end

    e_var=var/num
    e_var_sqrt=Math.sqrt(e_var).round(2)

    return e_var_sqrt
  end

end

# ・
# ・本日から最低 n 日以前からランダムに1日選ぶ
# ・選んだ銘柄すべての銘柄に関して、選んだ1日を起点にしてn 日間のポートフォリオ資産推移を計算する
# ・各試行で合計損益、最大ドローダウン、を求める。
# ・これをm回繰り返し、各値の平均を算出する。
# （ただし、同じ日は選ばない、またn/2は離れているものとする
# ・最大ドローダウン=VaR
