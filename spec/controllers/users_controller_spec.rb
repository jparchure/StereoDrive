require 'spec_helper'



describe UsersController do
	render_views

	describe "Display user data" do
		  
		it "should show error msg if not logged in" do
      		#puts(current_user)
      		request.accept = "application/json"
      		get :show, id: '1'
      		response.should be_redirect
		end


    it "should fetch User data if logged in" do
          #ApplicationController.instance_variable_get(:var)
          visit root_path
          facebook_hash

          click_link "Login"
          user = User.first
          ApplicationController.any_instance.stub(:set_current_user)
          controller.instance_eval{@current_user = user}
          @current_user = user
          #allow(controller).to receive(:set_current_user).and_return(User.first)
          #controller.stub!(@current_user).and_return(User.first)
          request.accept = "application/json"
          get :show, id: '1'
          
          user=User.find(controller.params[:id])
          parsed_body = JSON.parse(response.body)
          parsed_body["name"].should === user.name
    end

    it "should delete bands if clicked on" do
    end
	end
end
