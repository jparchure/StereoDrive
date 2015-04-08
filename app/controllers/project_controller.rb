class ProjectController < ApplicationController
  def create
    createdProject = Project.create()

    render :json => { 'success' => true, 'key' =>createdProject.id}
  end

  def show
     project = Project.find_by!(id: (params[:id] ) )

    render :json => { 'success' => true, 'key'  => project.id}
  end

  def delete
    project = params[:project]
    project = Project.find_by!(id: project['key'])
    project.destroy()

    render :json => { 'success' => true, 'key' => project.id}
  end
end
