class AdminsController < ApplicationController

  require 'csv'

  def admin
  end

  def import
    CSV.foreach(params[:info][:file].tempfile, headers: true) do |row|

      #ファイルネームからコードと銘柄名を取り出す
      file_name=params[:info][:file].original_filename
      file_name2=file_name.split("-")
      stock_code=file_name2[0]
      stock_name=file_name2[1].delete(".csv")

      #データベースからアップロードするデータ情報を検索する
      exist_code=Stock.find_by(code: stock_code)
      exist_date=Stock.find_by(code: stock_code, date: row["date"])

      # コード、日付がどちらもない
      if exist_code==nil && exist_date==nil then

        @stock = Stock.new(
          code: stock_code,
          name: stock_name,
          date: row['date'],
          volume: row['volume'],
          adjust: row['adjust']
        )

        @stock.save


      #コードはあるが、日付はない
      elsif exist_code!=nil && exist_date==nil then

        @stock = Stock.new(
          code: stock_code,
          name: stock_name,
          date: row['date'],
          volume: row['volume'],
          adjust: row['adjust']
        )

        @stock.save

      #コードも日付もある
      else

        break

      end
    end

    redirect_to admins_admin_path

  end
end
