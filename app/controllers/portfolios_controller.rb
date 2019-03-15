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

    portfolio=Portfolio.find_by(group_name: params[:name])
    portfolio.destroy

    group=Group.where(group_name: params[:name])

    group.each do|g|
        g.destroy
    end

    redirect_to root_path
  end
end

