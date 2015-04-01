require 'rails_helper'



describe UsersController do
	render_views
	before do
		#controller.stub(:_routes).and_return(@routes)
		@m=FactoryGirl.create :user

		def login(user)
    		#user = User.where(:login => user.to_s).first if user.is_a?(Symbol)
    		request.session[:user] = user.id
  		end

  		def current_user
    		User.find(request.session[:user])
  		end
	end
	describe "Display user data" do
		
		it "should show error msg if not logged in" do
			#, name: 'John A Doe', email: "john@exampl.com", id: 1
      		#FactoryGirl.create :movie, name: "The Two Towers"
      		#login(@m)
      		#puts(current_user)
      		request.accept = "application/json"
      		
      		#request.format="json"
      		#json = { :format => 'json'}#, :application => @m}
      		#puts(@m)
      		get :show, id: '1'
      		#get #, format: :json#, application: @m
      		#expect(response.status).to eq 200
      		#puts(JSON.parse(response.body)["status"])
      		#body = JSON.parse(response.body)
      		#username = body["first_name"]
      		#expect(response.status).to eq 200
      		
      		#body = JSON.parse(response.body)
      		#expect(body["name"]).to eq 'John A Doe'
      		#response.should be_redirect
      		response.should be_success
#      		expect(username).to equal("John")
		end
	end
end
