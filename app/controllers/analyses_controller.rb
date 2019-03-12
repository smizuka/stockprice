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

end
