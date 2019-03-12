class SimulationsController < ApplicationController

    require 'net/http'
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

        uri = URI('http://0.0.0.0:5000/simulation')
        req = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
        req.body = datas.to_json
        res = Net::HTTP.start(uri.hostname, uri.port) do |http|
            http.request(req)
        end

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

        start_price=0
        i=0
        prices.each do |price|
            start_price+=price*obtain_stocks[i]*100
            i+=1
        end

        n= return_datas.length-1

        res ={
            "return": return_datas,
            "start": return_datas[0],
            "end": return_datas[n]
        }

        render json: res.to_json

    end
end

# ・
# ・本日から最低 n 日以前からランダムに1日選ぶ
# ・選んだ銘柄すべての銘柄に関して、選んだ1日を起点にしてn 日間のポートフォリオ資産推移を計算する
# ・各試行で合計損益、最大ドローダウン、を求める。
# ・これをm回繰り返し、各値の平均を算出する。
# （ただし、同じ日は選ばない、またn/2は離れているものとする
# ・最大ドローダウン=VaR
