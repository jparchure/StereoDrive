class ClipsController < ApplicationController
  def create
    if(params[:clip] && params[:track])
      trackData = params[:track]

      clipData = Hash.new
      clipData[:audio_key] = params[:clip][:audio_key]
      clipData[:pos_in_track] = params[:clip][:pos_in_track]
      clipData[:start] = params[:clip][:start]
      clipData[:end] = params[:clip][:end]
      clipData[:clip_id] = params[:clip][:clip_id]
      # in future refer to Project.Track

      track = Track.find_by key: trackData[:number]
      audio = Audio.find_by key: clipData[:audio_key]

      clip = track.clips.new clipData
      clip.audio_id = audio.id
      clip.save

      # How to associate with audio as well?
      #Clip.create params[:clip]
      render :json => {'success' => true, 'clip' => clip}
    else
      render :json => {'success' => false}
    end
  end
end
