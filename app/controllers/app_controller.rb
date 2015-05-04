class AppController < ApplicationController
  def index
  end
  def show
	if(@current_user.nil?) 
		redirect_to root_path
	end
  end
end
