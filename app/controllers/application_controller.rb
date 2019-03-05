class ApplicationController < ActionController::Base
  #applicatonはコントローラーやモデルで使用する場合に必要
  #helperはviewファイルで関数を使用する際に必要になってくる。
  #helper関数に配置しないとview内で関数として使用できない

  helper_method :current_user, :logged_in?

  # 現在のユーザーを出力する関数
  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  # ログイン状態かどうかを調べる関数
  def logged_in?
    !current_user.nil?
  end

end
