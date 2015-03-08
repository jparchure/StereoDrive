class Track < ActiveRecord::Base
  attr_accessible :track_name, :key
  #belongs_to :project
  has_many :clips
end