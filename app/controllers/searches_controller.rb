class SearchesController < ApplicationController

  def index

    if !params[:value].blank?
      @stock = Stock.search_by_keyword(params[:value])

      puts "--------------------------"
      puts @stock
      puts "--------------------------"
      #検索に該当するコードを取得する
      @stocks=@stock.select("code,name").distinct.order("code")
      # where(name like '%72%' or code like '%72%'))
    end

    #heroku用に書き換え

    # @stock.where(name like '%#%' or code like '%#{code}%')
    # SELECT DISTINCT code,name FROM "stocks" WHERE (name like '%72%' or code like '%72%') ORDER BY code)


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

    render json: res.to_json
  end

end



