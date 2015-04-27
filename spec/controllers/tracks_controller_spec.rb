describe '#index' do
  it 'should return all tracks' do
    Track.create!(file_name: 'test',key: 'test')
    # create sound in track
    get :index
    parsed_response = JSON.parse(response.body)
    expect(parsed_response.length ).to be(1)
  end
end

describe '#create' do
  it 'should create a track when project exists'
    project = Project.find_by id: 1



    post :create, format: :json

    parsed_response = JSON.parse(response.body)
    expect(parsed_response["success"]).to be(true)
  end

  it 'should not add track when project doesnt exist' do

    #doesnt work because i dont have projects associated with user

    post :create, format: :json

    parsed_response = JSON.parse(response.body)
    expect(parsed_response["success"]).to be(false)

  end
end