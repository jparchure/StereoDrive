require 'rails_helper'

describe AudioController do
  describe '#create' do
    it 'should deny invalid file types' do

      file = false
      post :create, file: file, format: :json

      parsed_response = JSON.parse(response.body)
      expect(parsed_response["success"]).to be(false)
      #expect( create :file => {stuff} ).to_equal({success: false})
    end
  end
  describe '#index' do
    it 'should return all audio' do
      Audio.create!(file_name: 'test',key: 'test')
      # create sound in track
      get :index
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.length ).to be(1)
    end
  end
end