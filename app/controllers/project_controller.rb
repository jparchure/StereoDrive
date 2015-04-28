class ProjectController < ApplicationController
  def create
    @artist = Artist.find(1) 
    createdProject = @artist.projects.create
    puts(createdProject)

    render :json => { 'success' => true, 'key' =>createdProject.id}

  end

  def index

    project = Project.all

    render :json => {'success'=> true, 'projects' => project}

  end

  def list

    artist = @current_user.artists.find_by_id(params[:id])
    projects = artist.projects.all

    render :json => {'success'=> true, 'projects' => projects}

  end

  def show
    project = Project.find_by!(id: (params[:id] ) )


    allTrack  = Array.new

    #get signed urls for each audio file
    project.tracks.each{ |a|
      trackInfo = Hash.new
      trackInfo['project'] = a.project_id
      trackInfo['key'] = a.id
      allTrack.push(trackInfo)
    }


    # This method will return signed URLs to each sound in the project
    allAudio  = Array.new
    # Get info from db
    audio = Audio.all

    #get signed urls for each audio file
    audio.each{ |a|
      project_name = 'ExampleProject'
      sound = Hash.new
      sound['file_name'] = a.file_name
      sound['key'] = a.key
      sound['audioUrl'] = create_sound_url project_name, a.key

      clips = Array.new
      a.clips.each{ |clip|
        clipData = Hash.new
        clipData[:audio_key] = clip.audio_key
        clipData[:pos_in_track] = clip.pos_in_track
        clipData[:start] = clip.start
        clipData[:end] = clip.end
        clipData[:clip_id] = clip.clip_id
        clipData[:track_id] = clip.track_id
        clips.push clipData
      }
      sound[:clips] = clips

      allAudio.push(sound)
    }



    render :json => { 'success' => true, 'project'  => project, 'tracks' => allTrack, 'audio' => allAudio}
  end
  def create_sound_url (project, key)
    bucket = 'stereodrive.dev'
    path = project << '/' << key << '.mp3'
    expire_date = (Time.now + 10.minutes).to_i
    digest = OpenSSL::Digest.new('sha1')
    can_string = "GET\n\n\n#{expire_date}\n/#{bucket}/#{path}"
    hmac = OpenSSL::HMAC.digest(digest, 'dl5FHHH2PphG7ccWAucn7RSsTiljHAkm7lgEr//O', can_string)
    signature = URI.escape(Base64.encode64(hmac).strip).encode_signs

    "https://s3.amazonaws.com/#{bucket}/#{path}?AWSAccessKeyId=AKIAIMHCBU7BTMVYEWOA&Expires=#{expire_date}&Signature=#{signature}"
  end
  def getTracks


  end

  def getAudio

  end


  def delete
    project = params[:project]
    project = Project.find_by!(id: project['key'])
    project.destroy()

    render :json => { 'success' => true, 'key' => project.id}
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
