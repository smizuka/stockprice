class UsersController < ApplicationController

  #トップページ
  def top
  end

  #サインイン画面に遷移
  def signup
    @user=User.new
  end

  #ログイン画面に遷移
  def login
  end

  #登録情報変更画面に遷移
  def edit
  end

  def update
    @user = User.find(current_user.id)

    #検索するだけの場合ストロングパラメータに通す必要はない。
    if @user && @user.authenticate(params[:change][:old_password])
      #データベースに登録する場合、ストロングパラメータに登録する
      if @user.update_attributes(change_params)
        redirect_to root_path
      else
        render 'edit'
      end
    else
      render 'edit'
    end
  end

  # 新規ユーザー登録メゾット
  def create
    @user=User.new(user_params)
    # user=User.new(user)

    if @user.save
      redirect_to root_url
    else
      render :signup
    end
  end

  # ログインアクション
  def auth
    user=User.find_by(email_params)
    if user && user.authenticate(password_params[:password])
      log_in user
      redirect_to mypages_index_path
    else
      render :login
    end
  end

  # ログアウト機能
  def destroy
    log_out
    redirect_to root_url
  end

  private
  #新規会員登録のときのストロングパラメーター
  def user_params
    params.require(:user).permit(:name,:email,:password,:password_confirmation)
  end

  #ログインの際のセッション
  def log_in(user)
    session[:user_id]=user.id
  end

  def email_params
    params.require(:session).permit(:email)
  end

  def password_params
    params.require(:session).permit(:password)
  end

  # ユーザー情報変更のときのコード
  def change_params
    params.require(:change).permit(:password,
      :password_confirmation)
  end

  #ログアウトするときのセッション
  def log_out
    session.delete(:user_id)
    @current_user=nil
  end

end
