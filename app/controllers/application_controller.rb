class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :set_current_user
  def set_current_user
    @current_user ||= session[:token] && User.find_by_session(session[:token])
  end
  def send_current_user
	render json: @current_user
  end

end
