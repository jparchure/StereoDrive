class TrackController < ApplicationController

  def create

    project = Project.find_by id: params[:project]

    createdTrack = project.tracks.create!

    render :json => { 'success' => true, 'key' =>createdTrack.id, 'project_id' => createdTrack.project_id}
  end

  def index
    # This method will return signed URLs to each sound in the project
    allTrack  = Array.new


    project = Project.find_by id: params[:project_id]


    #track = Track.where("project_id" = project_id)
    #Should do get track based on project number


    #get signed urls for each audio file
    project.tracks.each{ |a|
      trackInfo = Hash.new
      trackInfo['project'] = a.project_id
      trackInfo['key'] = a.id

      clips = Array.new
      a.clips.each{ |clip|
        clipData = Hash.new
        clipData[:audio_key] = clip.audio_key
        clipData[:pos_in_track] = clip.pos_in_track
        clipData[:start] = clip.start
        clipData[:end] = clip.end
        clipData[:clip_id] = clip.clip_id
        clipData[:track_id] = clip.track_id
        clips.push clipData
      }

      trackInfo[:clips] = clips
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