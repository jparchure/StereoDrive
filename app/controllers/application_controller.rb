class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :set_current_user
  def set_current_user
    @current_user ||= session[:token] && User.find_by_session(session[:token])
    respond_to do |format|
	format.json { render json: @current_user.as_json }
    end
  end
end
