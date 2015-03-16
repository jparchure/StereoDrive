require 'rails_helper'

describe SessionsController do
  describe 'Logging out' do
    it 'should remove session variable' do
      session[:token] = "test_user"
      delete :destroy
      expect(session[:token]).to equal(nil)
    end
  end
end

