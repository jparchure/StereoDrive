# This file is app/controllers/artists_controller.rb
class ArtistsController < ApplicationController
  def  
    id = params[:id]
    if(!@current_user.nil?)
      @artists = User.find(id).artists
      render json: @artists
    else
      flash[:warning] = "You must login to do that!"
      redirect_to root_path
    end
  end
end
