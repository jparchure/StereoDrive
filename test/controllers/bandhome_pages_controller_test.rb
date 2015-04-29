require 'test_helper'

class BandhomePagesControllerTest < ActionController::TestCase
  test "should get bandhomepage" do
    get :bandhomepage
    assert_response :success
  end

end
