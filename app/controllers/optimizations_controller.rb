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

    # uri = URI.parse('http://0.0.0.0:5000/optimisation')
    # uri = URI.parse('https://sampleapp0215.herokuapp.com/statistic')
    # res = Net::HTTP.post_form(uri,datas)

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
    @data2=[]
    #ポートフォリオで得られる目標リターン
    @data3=[]

    # 各銘柄ごとにリストに入れなおす
    # for i in 0..num do
    #   n1=[codes[i],names[i],opt_datas["mean"][i].round(2),opt_datas["std"][i].round(2)]
    #   @data1.push(n1)
    # end

    # 各ポートフォリオの目標リターン(target)、想定リスク(risk)
    for i in 0..4 do
      n2=[i+1,opt_datas["target"][i].round(2),opt_datas["risk"][i].round(2)]
      @data2.push(n2)
    end

    values=[]

    #各ポートフォリオにおける各銘柄の割合を入れたリストを作成
    opt_datas["weight"].each do|weights|
      n=[]
      # 配列に対してround(2)は使えないので１つずつ取り出してroundした
      weights.each do |weight|
        n.push(weight.round(2))
      end
      values.push(n)
    end

    puts values[0]

    res ={
        labels: codes,
        datas: values
    }

    render json: res.to_json

  end

  # お気に入り削除
  def destroy
  end

end
