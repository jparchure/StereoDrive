class AudioController < ApplicationController

  # upload file to s3, and on success, add the filename and key to the database
  def create
    if(params[:file])
      file = params[:file]

      if( ((file.content_type <=> "audio/mpeg") == 0)||((file.content_type <=> "audio/mp3") == 0))
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
          render :json => { 'success' => true, 'file_name' => file.original_filename, 'key' => uuid}
        else
          render :json => { 'success' => false, 'error' => "Could not upload"}
        end
      else
        render :json => { 'success' => false, 'error' => ("Invalid file type: "+file.content_type)}
      end
      render :json => { 'success' => false, 'error' => "No file"}
    end
    render :json => { 'success' => false, 'error' => ("Incorrect FileType")}
  end

  def delete
    # This will remove a sound

    # Remove from s3
    #if successful, remove from db
    render :json => {"implimented" => false}
  end

  def index
    # This method will return signed URLs to each sound in the project
    allAudio  = Array.new
    # Get info from db
    audio = Audio.all
    digest = OpenSSL::Digest::Digest.new('sha1')
    expire_date = (Time.now + 10.minutes).to_i
    bucket = 'stereodrive.dev'


    #######
    #signer = Aws::S3::Presigner.new :region => 'us-east-1'

    #get signed urls for each audio file
    audio.each{ |a|

      path = 'ExampleProject/' << a.key << '.mp3'
      can_string = "GET\n\n\n#{expire_date}\n/#{bucket}/#{path}"
      hmac = OpenSSL::HMAC.digest(digest, 'dl5FHHH2PphG7ccWAucn7RSsTiljHAkm7lgEr//O', can_string)
      signature = URI.escape(Base64.encode64(hmac).strip).encode_signs

      sound = Hash.new
      sound['file_name'] = a.file_name
      sound['key'] = a.key
      #url = signer.presigned_url(:get_object, bucket: bucket, key: a.key)
      sound['url'] = "https://s3.amazonaws.com/#{bucket}/#{path}?AWSAccessKeyId=AKIAIMHCBU7BTMVYEWOA&Expires=#{expire_date}&Signature=#{signature}"
      allAudio.push(sound)
    }
    # add them into the same reply
    render :json => allAudio
  end

  private
  def audio_params
    params.require(:audio).permit(:file, :key)
  end
end

class String
  def encode_signs
    signs = {'+' => "%2B", '=' => "%3D", '?' => '%3F', '@' => '%40',
             '$' => '%24', '&' => '%26', ',' => '%2C', '/' => '%2F', ':' => '%3A',
             ';' => '%3B', '?' => '%3F'}
    signs.keys.each do |key|
      self.gsub!(key, signs[key])
    end
    self
  end
end
