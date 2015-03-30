require 'rails_helper'

describe SessionsController do
  describe 'Logging in' do
	before { visit root_path}
	it "can sign in user with Twitter account" do
	    page.should have_content("StereoDrive")
	    facebook_hash
	    click_link "Login"
	    page.should have_content("Logout")
	  end
  end

  describe 'Logging out' do
    it 'should remove session variable' do
      session[:token] = "test_user"
      delete :destroy
      expect(session[:token]).to equal(nil)
    end
  end
end

