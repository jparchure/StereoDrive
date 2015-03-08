class TrackController < ApplicationController

  def create

    track = params[:track]

    Track.create(track_name: track['name'],key: track['number'])
    render :json => { 'success' => true}

  end

  def index
    # This method will return signed URLs to each sound in the project
    allTrack  = Array.new
    # Get info from db
    track = Track.all

    #get signed urls for each audio file
    track.each{ |a|
      trackInfo = Hash.new
      trackInfo['name'] = a.track_name
      trackInfo['number'] = a.key
      allTrack.push(trackInfo)
    }

    # add them into the same reply
    render :json => allTrack
  end

  def rename
    track = params[:track]
    track = Track.find_by!(track_name: track['name'])
    track.track_name = 'newName'
    render :json => { 'success' => true}
  end

  def delete
    #should delete all audio in audio_controller as well
    track = params[:track]
    track = Track.find_by!(track_name: track['name'])
    track.destroy()
    render :json => { 'success' => true}
  end
end