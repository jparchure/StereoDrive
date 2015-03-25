class ClipsController < ApplicationController
  def create
    if(params[:clip] && params[:track])
      trackData = params[:track]
      # in future refer to Project.Track
      track = Track.where(:trackId => trackData[:id])

      # How to associate with audio as well?
      Clip.create params[:clip]
      render :json => {'success' => true}
    else
      render :json => {'success' => false}
    end
  end
end
