class ProjectController < ApplicationController
  def create
    createdProject = Project.create()

    render :json => { 'success' => true, 'key' =>createdProject.id}
  end

  def delete
    project = params[:track]
    project = Track.find_by!(id: project['key'])
    project.destroy()

    render :json => { 'success' => true, 'key' => project.id}
  end
end
