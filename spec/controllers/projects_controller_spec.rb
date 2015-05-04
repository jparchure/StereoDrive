require 'rails_helper'

describe ProjectsController do
  describe 'Create Project' do
    before do 
	visit root_path
	facebook_hash
    end
    it '' do
      click_link "Logout"
      expect(session[:token]).to equal(nil)
    end
  end
end

