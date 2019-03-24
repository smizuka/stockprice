class FavoritesController < ApplicationController

  def create

    favorite=Favorite.new
    favorite.user_id=current_user.id
    favorite.code=params[:code]

    if Favorite.find_by(code: params[:code])!=nil

      render json: comment.errors.to_json
    else
      favorite.save

      #stockモデルのコードに該当する値を取得する
      stock=Stock.find_by(code: params[:code])

      price=Stock.code_index(params[:code]).date_desc(2)
      # diff=((price[0].adjust-price[1].adjust)/price[1].adjust).round(2)*100

      res = {
        code: stock.code,
        name: stock.name,
        date: stock.date,
        adjust: stock.adjust,
        # diff: diff
      }

      render json: res.to_json

    end
  end

  def destroy

    favorite=Favorite.find_by(code: params[:code])
    favorite.destroy

  end

end
