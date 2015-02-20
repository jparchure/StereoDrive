# This file is app/controllers/users_controller.rb
class SessionsController < ApplicationController
  def create
    auth = request.env['omniauth.auth']
    user = User.omniauth(auth)
    user.update_attributes(:token => auth["credentials"]["token"])
    session[:token] = user.session
    redirect_to root_path
  end
  def destroy
    session[:session] = nil 
    flash[:notice] = "Logout Successful"
    redirect_to root_path
  end

end
