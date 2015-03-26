require 'rails_helper'

describe SessionsController do
  describe 'Logging in' do
    it 'should update user attributes' do
      user = double(User)
      allow(User).to receive(:omniauth)
      expect(user).to receive(:update_attributes)
      get :create, provider: 'facebook'
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

