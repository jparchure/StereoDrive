class ProjectController < ApplicationController
  def create
    createdProject = Project.create()

    render :json => { 'success' => true, 'key' =>createdProject.id}

  end

  def index

    project = Project.all

    render :json => {'success'=> true, 'projects' => project}
  end
  def show
    project = Project.find_by!(id: (params[:id] ) )


    allTrack  = Array.new

    #get signed urls for each audio file
    project.tracks.each{ |a|
      trackInfo = Hash.new
      trackInfo['project'] = a.project_id
      trackInfo['key'] = a.id
      allTrack.push(trackInfo)
    }


    render :json => { 'success' => true, 'project'  => project, 'tracks' => allTrack}
  end

  def getTracks


  end

  def getAudio

  end


  def delete
    project = params[:project]
    project = Project.find_by!(id: project['key'])
    project.destroy()

    render :json => { 'success' => true, 'key' => project.id}
  end
end
