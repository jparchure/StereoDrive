require 'rails_helper'

describe SessionsController do
  describe 'Logging in' do
	before { visit root_path}
	it "can sign in user with Facebook account" do
	    page.should have_content("StereoDrive")
	    facebook_hash
	    click_link "Login"
	    page.should have_content("Logout")
	  end
	it "will ensure user has a SOLO BAND" do
	    facebook_hash
	    click_link "Login"
	    user = User.first
	    expect(user.artists.count).to eq(1)
	  end
  end

  describe 'Logging out' do
    before do 
	visit root_path
	facebook_hash
	click_link "Login"
    end
    it 'should remove session variable' do
      click_link "Logout"
      expect(session[:token]).to equal(nil)
    end
  end
end

