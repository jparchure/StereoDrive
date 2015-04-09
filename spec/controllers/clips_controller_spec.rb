require 'rails_helper'


describe ClipsController do
  describe '#create' do
    it 'should add clip when track and audio exist' do
      track = Track.create!
      Audio.create!(file_name: 'test',key: 'test')

      clipData = Hash.new
      clipData[:audio_key] = 'test'
      clipData[:pos_in_track] = 0
      clipData[:start] = 0
      clipData[:end] = 0
      clipData[:clip_id] = '0'

      trackData = Hash.new
      trackData[:key] = track.id

      post :create, clip: clipData, track: trackData, format: :json

      parsed_response = JSON.parse(response.body)
      expect(parsed_response["success"]).to be(true)

    end
    it 'should not add clip when track doesnt exist' do
      Audio.create!(file_name: 'test',key: 'test')

      clipData = Hash.new
      clipData[:audio_key] = 'test'
      clipData[:pos_in_track] = 0
      clipData[:start] = 0
      clipData[:end] = 0
      clipData[:clip_id] = '0'

      trackData = Hash.new
      trackData[:key] = 0

      post :create, clip: clipData, track: trackData, format: :json

      parsed_response = JSON.parse(response.body)
      expect(parsed_response["success"]).to be(false)

    end

    it 'should not add clip when audio doesnt exist' do
      track = Track.create!

      clipData = Hash.new
      clipData[:audio_key] = 'test'
      clipData[:pos_in_track] = 0
      clipData[:start] = 0
      clipData[:end] = 0
      clipData[:clip_id] = '0'

      trackData = Hash.new
      trackData[:key] = track.id

      post :create, clip: clipData, track: trackData, format: :json

      parsed_response = JSON.parse(response.body)
      expect(parsed_response["success"]).to be(false)

    end
  end

  describe '#update' do
    it 'should update if sent propper params' do
      track = Track.create!
      Audio.create!(file_name: 'test',key: 'test')

      clipData = Hash.new
      clipData[:audio_key] = 'test'
      clipData[:pos_in_track] = 0
      clipData[:start] = 0
      clipData[:end] = 0
      clipData[:clip_id] = '0'

      trackData = Hash.new
      trackData[:key] = track.id

      post :create, clip: clipData, track: trackData, format: :json

      clipData[:pos_in_track] = 1

      put :update, id: clipData[:clip_id], clip: clipData, format: :json


      parsed_response = JSON.parse(response.body)
      expect(parsed_response["success"]).to be(true)
    end

    it 'should not update if sent impropper params' do

      put :update, id: '0', clip: nil, format: :json

      parsed_response = JSON.parse(response.body)
      expect(parsed_response["success"]).to be(false)
    end

    it 'should not update if clip doesnt exist' do
      clipData = Hash.new
      clipData[:audio_key] = 'test'
      clipData[:pos_in_track] = 0
      clipData[:start] = 0
      clipData[:end] = 0
      clipData[:clip_id] = '0'

      clipData[:pos_in_track] = 1
      put :update, id: clipData[:clip_id], clip: clipData, format: :json

      parsed_response = JSON.parse(response.body)
      expect(parsed_response["success"]).to be(false)
    end
  end
end
