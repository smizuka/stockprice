class Stock < ApplicationRecord

  #銘柄名あるいはコードが含まれる場合の対応
  #２変数指定した場合は#{}も２つ指定しなければならない
  # scope :search_by_keyword, -> (keyword) {
  #   where("name like ? or code like ?","%#{keyword}%","%#{keyword}%") if keyword.present?
  # }
  scope :search_by_keyword, -> (keyword) {
    where("name like ? or code like ?","%#{keyword}%","%#{keyword}%") if keyword.present?
  }

  #指定したコードの銘柄データをすべて取得する
  scope :code_index, -> (code){where("code=?",code)}

  #取得した:date（日時）を降順（新しい順）に並べて直近count分の日分の価格を取得
  scope :date_desc, -> (count){order(date: :desc).limit(count)}

  # has_many :favorites
  def favorites
    return Favorite.where(code: self.code)
  end

  # has_many :favorite_users,through: :favorites, source: "user"
  def favorite_users
    array = []
    favorites = Favorite.where(code: self.code)
    favorites.each do |favorite|
      array << User.find_by(id: favorite.user_id)
    end
    return array
  end

end
