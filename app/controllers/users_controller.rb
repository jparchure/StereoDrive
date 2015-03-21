# This file is app/controllers/users_controller.rb
class UsersController < ApplicationController
  def show
    id = params[:id]
    if(!@current_user.nil?)
      @user = User.find(id)
      render json: @user
    else
      flash[:warning] = "You must login to do that!"
      redirect_to root_path
    end
  end
end
