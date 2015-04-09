

class ClipsController < ApplicationController
  def create
    if(params[:clip] && params[:track])
      trackData = params[:track]


      track = Track.find_by id: (trackData[:key])
      audio = Audio.find_by key: (params[:clip][:audio_key])

      if(track)
        if(audio)

          clipData = Hash.new
          clipData[:audio_key] = params[:clip][:audio_key]
          clipData[:pos_in_track] = params[:clip][:pos_in_track]
          clipData[:start] = params[:clip][:start]
          clipData[:end] = params[:clip][:end]
          clipData[:clip_id] = params[:clip][:clip_id]
          # in future refer to Project.Track

          track = Track.find_by id: (trackData[:key])
          audio = Audio.find_by key: (clipData[:audio_key])

          clip = track.clips.new clipData
          clip.audio_id = audio.id
          clip.save

          # How to associate with audio as well?
          #Clip.create params[:clip]
          render :json => {'success' => true, 'clip' => clip}
        else
          render :json => {'success' => false}
        end
      else
        render :json => {'success' => false}
      end
    else
      render :json => {'success' => false}
    end
  end

  def update
    if(params[:clip])
      clip = Clip.find_by clip_id: (params[:clip][:clip_id])
      if(clip)

        clip.pos_in_track = params[:clip][:pos_in_track]
        clip.start = params[:clip][:start]
        clip.end = params[:clip][:end]

        clip.save
        render :json => {'success' => true}
      else
        render :json => {'success' => false}
      end
    else
      render :json => {'success' => false}
    end
  end
end