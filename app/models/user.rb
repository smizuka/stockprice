class User < ApplicationRecord

    validates :name, presence: {message:"を入力してください"}
  validates :email, presence: {message:"を入力してください"}
  validates :password, presence: {message:"を入力してください"}
  validates :password_confirmation, presence: true

  #emailの形式指定
  validates :email, format:{with:/[A-Za-z0-9._+]+@[A-Za-z]+.[A-Za-z]/,message:"アドレスを登録してください"}

  # パスワードの文字数を制限
  validates :password, length: {in: 8..32,too_long:"は３２文字以内にしてください",too_short:"は８文字以上にしてください"}

  # パスワードの文字種を制限
  validates :password,format: {with: /(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)/,message:"%{value}はアルファベット（大小）と半角数字の混合にしてください"}

  #パスワードが一致しているかの確認
  validates :password,confirmation: {message: "とpasswordの値が一致しません"}

  has_secure_password
  has_many :favorites

  #portfoliosモデルとの関連
  has_many :portfloios
  has_many :groups
end
