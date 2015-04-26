# This file is app/controllers/users_controller.rb
class SessionsController < ApplicationController
  def create
    auth = request.env['omniauth.auth']
    user = User.omniauth(auth)
    user.update_attributes(:token => auth["credentials"]["token"])
    session[:token] = user.session
    cookies[:id] = user.id
    if(user.artists.count == 0)
        hash = {:name => user.name+"'s Solo Band", :image=>user.image, :page=>user.page, :location=>user.location, :is_solo => true}
    	user.artists << Artist.create!(hash)
    end
    redirect_to app_path(user.id)
  end
  def destroy
    session[:token] = nil 
    flash[:notice] = "Logout Successful"
    redirect_to root_path
  end

end
