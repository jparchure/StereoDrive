# This file is app/controllers/users_controller.rb
class UsersController < ApplicationController
  def show
    id = params[:id]
    puts("CURRENT USER BRO", @current_user)
    if(!@current_user.nil?)
      @user = User.find(id)
      render json: @user
    else
      flash[:warning] = "You must login to do that!"
      redirect_to root_path
    end
  end

  def update
    #puts("Params", params)
    #id=params[:id]
    @user = User.find(params[:id])
 
    puts("CU", session)
    puts("USER", @user)
    if(@current_user!=@user)
      flash[:warning] = "You can not edit someone else's profile"
      puts("Failed someone else")
    elsif(@current_user.nil?)
      flash[:warning] = "You must login to do that!"
      puts("Un login")
    else
      @user = User.update_user(params)
      if(!@user)
        puts("Failed")
        flash[:warning] = "Sorry update failed"
      end
    
    end
    redirect_to root_path
  end
end
