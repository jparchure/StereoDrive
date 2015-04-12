require 'rails_helper'



describe UsersController do
	render_views
	before { visit root_path
          facebook_hash

          click_link "Login"

         }
	describe "Display user data" do
		
		it "should show error msg if not logged in" do
      		#puts(current_user)
      		request.accept = "application/json"
      		get :show, id: '1'
      		response.should be_redirect
		end


    it "should fetch User data if logged in" do
          request.accept = "application/json"
          get :show, id: '1'
          user=User.find(controller.params[:id])
          parsed_body = JSON.parse(response.body)
          parsed_body["name"].should === user.name
    end
	end
end
