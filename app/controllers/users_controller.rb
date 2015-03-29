# This file is app/controllers/users_controller.rb
class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token, :only => [:update]

  def show
    #Displays user data on the page
    id = params[:id]
    if(!@current_user.nil?)
      @user = User.find(id)
      render json: @user
    else
      flash[:warning] = "You must login to do that!"
      redirect_to root_path
    end
  end

  def update
    @user = User.find(params[:id])

    updated_user = User.clean(params)
    puts("Before", @user.attributes.keys)
    if(@current_user!=@user)
      #If trying to edit some one else's profile
      flash[:warning] = "You can not edit someone else's profile"
      puts("Failed someone else")
    elsif(@current_user.nil?)
      #If trying to edit profile without logging in
      flash[:warning] = "You must login to do that!"
      puts("Un login")
    else
      @user.update(updated_user)
      #Update the user
      if(!@user)
        puts("Failed")
        flash[:warning] = "Sorry update failed"
      end
    end
    puts("After", @user.attributes)
    render :nothing => true
  end
end
