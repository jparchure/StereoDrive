class Clip < ActiveRecord::Base
  belongs_to :audio
  belongs_to :track

  attr_accessible :start, :end, :audio_key, :pos_in_track, :clip_id

end
