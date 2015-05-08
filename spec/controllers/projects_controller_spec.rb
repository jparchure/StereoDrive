require 'rails_helper'

describe ProjectController do
  describe 'Create Project' do
    before do
	DatabaseCleaner.clean 
    end
    it 'should call the create projects function' do
	visit root_path
	facebook_hash
	click_link 'Login'
	@artist = Artist.find(1)
	lambda do 
    		post :create, {:id=>1, :name=>'band'}
	end.should change(@artist.projects, :count).from(0).to(1)
	@artist.projects.map(&:name).should include("band")
    end
  end
end

