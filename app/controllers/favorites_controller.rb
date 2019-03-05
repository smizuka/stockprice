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

# <div class="col-md-4">
#     <div class="card bg-light shadow mb-4">
#         <h2 class="card-header">
#           STEP2
#         </h2>
#         <div class="card-body">
#             <table class="table table-hover">
#               <thead>
#                 <tr>
#                   <th class="col-xs-2">コード</th>
#                   <th class="col-xs-5">企業名</th>
#                   <th class="col-xs-2">日付</th>
#                   <th class="col-xs-2">前日終値</th>
#                   <th class="col-xs-2"></th>
#                 </tr>
#               </thead>
#               <tbody id="favorite-table">
#                 <% @favorites.each do |favorite| %>
#                   <tr>
#                     <td class="favorite-code"><%= favorite.stock.code %></td>
#                     <td><%= favorite.stock.name %></td>
#                     <td><%= favorite.stock.date %></td>
#                     <td><%= favorite.stock.adjust %></td>
#                     <td>
#                       <button class="btn btn-warning">削除</button>
#                       <%#= button_to "削除", {:controller => "favorites", :action => "destroy", :stock_code => favorite.stock.code},class: "btn btn-warning"%>
#                     </td>
#                   </tr>
#                 <% end %>
#               </tbody>
#             </table>
#         </div>
#     </div>
# </div>
