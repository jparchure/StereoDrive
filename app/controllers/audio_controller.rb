class AudioController < ApplicationController

  def create
    # Here we will upload file to s3

    s3 = Aws::S3::Resource.new(
      :access_key_id => 'ACCESS_KEY',
      :secret_access_key => 'SECRET_KEY',
      :region => 'us-east-1'
    )
    bucket = s3.bucket('stereodrive.dev')
    obj = bucket.object('newFile.mp3')
    obj.upload_file(params[:file].tempfile)


    render :json => {"implimented" => false, "test"=>"testing!"}
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
