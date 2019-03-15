class SearchesController < ApplicationController

  def index

    if !params[:value].blank?
      @stock = Stock.search_by_keyword(params[:value])
      #検索に該当するコードを取得する
      @stocks=@stock.select("code,name").distinct.order("code")
    end

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



