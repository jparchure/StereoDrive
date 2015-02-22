class AudioController < ApplicationController

  # upload file to s3, and on success, add the filename and key to the database
  def create
    file = params[:file]
    s3 = Aws::S3::Resource.new(
      :access_key_id => 'AKIAIMHCBU7BTMVYEWOA',
      :secret_access_key => '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',
      :region => 'us-east-1'
    )
    bucket = s3.bucket('stereodrive.dev')
    uuid = UUIDTools::UUID.random_create


    # create object key  {project}/{UUID}.mp3
    fileName = 'ExampleProject/' << uuid << '.mp3'
    obj = bucket.object(fileName)

    if(obj.upload_file(file.tempfile))
      Audio.create!(file_name: file.original_filename,key: uuid)
      # create sound in track
      render :json => { 'success' => true}
    else
      render :json => { 'success' => false}
    end
  end

  def delete
    # This will remove a sound
    render :json => {"implimented" => false}
  end

  def index
    # This method will return all sounds from a given project? possibly
    render :json => {"implimented" => false}
  end

  private
  def audio_params
    params.require(:audio).permit(:file, :key)
  end
end
