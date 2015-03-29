# This file is app/controllers/artists_controller.rb
class ArtistsController < ApplicationController
  def list 
    id = params[:id]
    if(!@current_user.nil?)
      @user = User.find(id)
      @artists = @user.artists.all
      render json: @artists
    else
      flash[:warning] = "You must login to do that!"
      redirect_to root_path
    end
  end
  def show
      id = params[:id]
      if(!@current_user.nil?)
        artist = Artist.find(id)
        render json: artist
      end
  end

  def update
    @artist = Artist.find(params[:id])
    updated_artist = Artist.clean(params)
    #How to check 
    if(@current_user!=@artist.owner)
      #If trying to edit some one else's band
      flash[:warning] = "You can not edit someone else's artist"
    elsif(@current_user.nil?)
      #If trying to edit artist without logging in
      flash[:warning] = "You must login to do that!"
    else
      @artist.update(updated_artist)
      #Update the user
      if(!@artist)
        puts("Failed")
        flash[:warning] = "Sorry update failed"
      end
    end
    render :nothing => true
  end
end
