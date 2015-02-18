class Sound < ActiveRecord::Base
  attr_accessible :startTime, :length
  belongs_to :audio
  belongs_to :track
end
