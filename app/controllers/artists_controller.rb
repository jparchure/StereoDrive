# This file is app/controllers/artists_controller.rb
class ArtistsController < ApplicationController
  skip_before_action :verify_authenticity_token
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
        puts(artist)
        render json: artist
      end
  end


  def members
      id = params[:id]
      if(!@current_user.nil?)
        artist = Artist.find(id)
        puts(artist.users)
        render json: artist.users
      end
  end
  def add_member
     if(!@current_user.nil?)
     	member = Users.find(params[:user_id])
     	band = @current_user.artists.find(params[:artist_id])
	if(!band.nil?)
		band.users << member
	end
	else
		flash[:warning] = "You are not a part of this Artist"
	end
	render :nothing => true
     end
     else
	flash[:warning] = "You must be logged in to do that!"
	redirect_to root_path
     end 
  end
  def update
    puts(params)
    @artist = Artist.find(params[:id])
    #@current_user= User.find()

    updated_artist = Artist.clean(params)
    #How to check 
    if(@current_user!=@artist.users[0])
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

  def create
	if(!@current_user.nil?)
          puts(params)
          artist = params
          hash = {:name => params["name"], :image=>params["image"], :page=>params["page"], :location=>params["location"]}
    	  @current_user.artists << Artist.create!(hash)
	end
  render :nothing=>true
  end
  def destroy
	if(!@current_user.nil?)
    puts(params)
	  artist = @current_user.artists.find(params["id"])
	  artist.destroy
	end
  render :nothing=>true
 end


end
