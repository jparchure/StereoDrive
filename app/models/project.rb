class Project < ActiveRecord::Base
  attr_accessible :name
  has_many :tracks
  has_many :audios
  belongs_to :artist
end
