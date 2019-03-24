class PortfoliosController < ApplicationController

  def create
    #portfollioに保存する
    portfolio=Portfolio.new
    portfolio.user_id=current_user.id
    portfolio.group_name=params[:name]
    portfolio.save

    #Groupに保存する
    params[:code].each do |code|
      group=Group.new
      group.group_name=params[:name]
      group.code=code
      group.user_id=current_user.id
      group.save

    end
  end

  def destroy
    #グループの名前と一致するポートフォリをを選択して削除する
    portfolio=Portfolio.find_by(group_name: params[:name])

    group=Group.where(group_name: params[:name])

    #transactionで囲むことで両方のモデルの削除がおこわ慣れないと
    #ロールバックされる
    Portfolio.transaction do
      Group.transaction do

        #削除に失敗したらFlaseなので文の前に!をつければ失敗したときの
        #メッセージが表示される
        portfolio.destroy

        group.each do|g|
            g.destroy
        end
      end
    end

    #-----------------------------------------------------
    #ここから一覧を表示するためのコード
    #-----------------------------------------------------
    names=current_user.groups.select("group_name").distinct
    # stock=current_user.groups.select(names[0])

    @lists=[]
    @names=[]

    names.each do |name|
      #グループ名を１つずつ取り出し、その名前が含まれるレコードすべて取得
      #そのレコードの中のcodeカラムの値を含むレコードをすべて取り出す
      stocks=Group.where(group_name: name.group_name).select("code")
      lists=[]
      stocks.each do |stock|
        #[code,銘柄名],リセット
        list=[]
        #codeを入れる
        list.push(stock.code)
        stock_name=Stock.where(code: stock.code).select("name").distinct
        # binding.pry
        #銘柄名を入れる
        list.push(stock_name[0].name.slice(0, 16))
        #リストに入れる
        lists.push(list)
      end
      #キーにポートフォリオ名、
      #バリューにポートフォリオに含まれる銘柄のリストを指定
      #このときnameはレコードなのでカラム名を指定して要素だけ取り出す
      @lists.push(lists)
    end

    names.each do |name|
      @names.push(name.group_name)
    end

    res={
      "lists": @lists,
      "names": @names
    }

    # render json: res.to_json

  end
end

