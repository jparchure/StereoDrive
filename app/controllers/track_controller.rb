class TrackController < ApplicationController

  def create
    createdTrack = Track.create()#technically will have sound data inside it
    render :json => { 'success' => true, 'key' =>createdTrack.id}
  end

  def index
    # This method will return signed URLs to each sound in the project
    allTrack  = Array.new
    # Get info from db
    track = Track.all

    #get signed urls for each audio file
    track.each{ |a|
      trackInfo = Hash.new
      trackInfo['key'] = a.id
      allTrack.push(trackInfo)
    }

    # add them into the same reply
    render :json => allTrack
  end

  def rename
    track = params[:track]
    track = Track.find_by!(id: track['key'])
    track.track_name = 'newName'
    render :json => { 'success' => true}
  end

  def delete
    #should delete all audio in audio_controller as well
    track = params[:track]
    track = Track.find_by!(id: track['key'])
    track.destroy()

    render :json => { 'success' => true, 'key' => track.id}
  end
end