class Audio < ActiveRecord::Base
  attr_accessible :audioFile, :startTime, :length
  #belongs_to :track
end
