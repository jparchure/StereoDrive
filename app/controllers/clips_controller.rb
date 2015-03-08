class ClipsController < ApplicationController
  def create
    if(params[:trackId] && params[:audioKey] && params[:clip])
      trackId = params[:trackId]
      audioKey = params[:audioKey]
      # in future refer to Project.Track
      track = Track.where(:trackId => trackId)
      audio = Audio.where(:key => audioKey)

      # How to associate with audio as well?
      track.clips.create(params[:clip])
      render :json => {'success' => true}
    else
      render :json => {'success' => false}
    end
  end
end
