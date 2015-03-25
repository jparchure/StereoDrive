class ApplicationController < ActionController::Base
<<<<<<< HEAD
  #protect_from_forgery
=======
  respond_to :html, :json
  protect_from_forgery
>>>>>>> c3ccce2055b2cefbceb16eb0e427b21e241aca6c
  before_filter :set_current_user
  def set_current_user
    @current_user ||= session[:token] && User.find_by_session(session[:token])
  end
  def send_current_user
	render json: @current_user
  end

end
