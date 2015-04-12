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
  def create
	if(!@current_user.nil?)
          hash = {:name => user.name+"'s Solo Band", :image=>user.image, :page=>user.page, :location=>user.location}
    	  @current_user.artists << Artist.create!(hash)
	end
  end
  def destroy
	if(!@current_user.nil?)
	  artist = @current_user.artists.find(:id)
	  artist.destroy
	end
end
