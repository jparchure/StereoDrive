class ApplicationController < ActionController::Base
  protect_from_forgery
  def set_current_user
    @current_user ||= session[:token] && User.find_by_session(session[:token])
  end
end
