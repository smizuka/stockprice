class OptimizationsController < ApplicationController

  require 'net/http'
  require 'uri'
  require 'json'

  def calc

    #jsでPOSTしたコード群
    codes = params[:data]
    datas={}

    #datas={code:[adjust]}の形でデータを入れていく
    codes.each do |code|
        values=Stock.code_index(code).pluck(:adjust)
        datas[code]=values
    end

    uri = URI('http://0.0.0.0:5000/optimisation')
    req = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
    req.body = datas.to_json
    res = Net::HTTP.start(uri.hostname, uri.port) do |http|
        http.request(req)
    end

    #戻ってきたJSONファイルをデコードする
    opt_datas = JSON.parse(res.body)

    names=[]
    # コードから名前を取得する
    codes.each do |code|
        names.push(Stock.find_by(code: code).name)
        # names.push(Stock.code_index(code).pluck(:name))
    end

    #codesの長さを取得する
    num = names.length-1

    #各ポートフォリオの目標リターン、想定リスク
    data1=[]

    # 各ポートフォリオの目標リターン(target)、想定リスク(risk)
    for i in 0..4 do
        n2=[i+1,opt_datas["target"][i].round(2),opt_datas["risk"][i].round(2)]
        n2=[opt_datas["target"][i].round(2),opt_datas["risk"][i].round(2)]
        data1.push(n2)
    end

    #各ポートフォリオにおける、各銘柄の比率を収納していくリスト
    data2=[]
    #各ポートフォリオにおける各銘柄の割合を入れたリストを作成
    opt_datas["weight"].each do|weights|
        n=[]
        # 配列に対してround(2)は使えないので１つずつ取り出してroundした
        weights.each do |weight|
          n.push(weight.round(2))
        end
        data2.push(n)
    end

    data3=[]

    opt_datas["weight2"].each do |weights2|
        n=[]
        weights2.each do |weight2|
          n.push(weight2.round(2))
        end
        data3.push(n)
    end

    res ={
        "risk": data1,
        "labels": codes,
        "datas": data2,
        "mean": opt_datas["mean"],
        "std": opt_datas["std"],
        #シミュレーションで使用するリスト
        "weights": data3
    }

    render json: res.to_json
  end

  # お気に入り削除
  def destroy
  end

end
