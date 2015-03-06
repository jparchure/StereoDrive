class TrackController < ApplicationController

  def create

    track = params[:track]

    Track.create!(track_name: track['name'],key: track['number'])

    render :json => { 'success' => true}

  end

  def rename
    track = params[:track]
    track = Track.find_by(track['name'])
    track.name = 'newName'
  end

  def delete
    #should delete all audio in audio_controller as well
    track = params[:track]
    track = Track.find_by(track['name'])
    track.destroy()
  end
end