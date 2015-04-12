class Audio < ActiveRecord::Base
  attr_accessible :file_name, :key
  #belongs_to :project
  has_many :clips
end
