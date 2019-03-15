class AnalysesController < ApplicationController

  require 'net/http'
  require 'uri'
  require 'json'
  require 'base64'

  def index
  end

  def calc

      codes = params["code"]

      stock_prices={}

      codes.each do |code|
          value=Stock.code_index(code).pluck(:adjust)
          # name=Stock.find_by(code: code).name
          stock_prices[code]=value
      end

      # APIに送るためにhash形式にする
      datas={
          "data": stock_prices,
      }

      uri = URI('http://0.0.0.0:5000/ts_analysis')
      req = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
      req.body = datas.to_json
      res = Net::HTTP.start(uri.hostname, uri.port) do |http|
          http.request(req)
      end

      #戻ってきたJSONファイルをデコードする
      # 各データの日数分のシミュレーションデータが入っている
      ana_datas = JSON.parse(res.body)

      # バイナリデータをデコードする
      #https://docs.ruby-lang.org/ja/latest/class/Base64.html
      bin = Base64.decode64(ana_datas["data"])

      File.open("./app/assets/images/analysis_result.png",'wb') do|f|
          f.write(bin)
      end

      # 「app/assets/images」ディレクトリに配置した画像ファイルは「/assets/画像ファイル名」で参照できるようになります)。
      res={"url": "/assets/analysis_result.png"}

      render json: res.to_json

  end

  def stat
      #現在価格
      new_price=Stock.code_index(params["data"]).date_desc(1)[0].adjust

      #古い順番からの時系列データ
      stocks=Stock.code_index(params["data"]).select("adjust")

      prices=[]
      stocks.each do |stock|
        prices.push(stock.adjust)
      end

      # num=prices.length-1

      change=(new_price.to_f-prices[0].to_f)/prices[0].to_f*100
      change2=change.round(2)
      puts change2

      res={
        "adjust": new_price,
        "change": change2,
        "mean": mean(return_data(prices)),
        "std": std(return_data(prices))
      }

      render json: res.to_json

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
