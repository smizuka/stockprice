class SearchesController < ApplicationController

  def index

    puts "--------------------------------"
    puts "indexs"

    if !params[:value].blank?
      @stock = Stock.search_by_keyword(params[:value])
      #検索に該当するコードを取得する
      @stocks=@stock.select("code,name").distinct.order("code")
      # where(name like '%72%' or code like '%72%'))
    end

    puts "--------------------------------"
    puts "データベースのあと"
    puts @stocks
    puts "--------------------------------"

    #レコードを配列にしていく
    n= @stocks.count

    if n!=0
      codes=[]
      names=[]

      @stocks.each do |stock|
        codes.push(stock.code)
        names.push(stock.name)
      end

      res ={
          code: codes,
          name: names
      }
    else
    # 該当する銘柄がない場合

      codes=[]
      names=[]

      res ={
          code: codes,
          name: names
      }

    end

    puts "--------------------------------"
    puts "返す前"

    render json: res.to_json
  end

end



