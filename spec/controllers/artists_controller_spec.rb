require 'spec_helper'
require 'rails_helper'



describe ArtistsController do
	render_views

	describe "Display user data" do
		  
		it "should show error msg if not logged in" do
      		#puts(current_user)
      		request.accept = "application/json"
      	#	get :show, id: '1'
      	   get :listall, substring: 'band'
           artist = Artist.all
           parsed_body = JSON.parse(response.body)
           parsed_body.should === artist
		end


   
	end
end
