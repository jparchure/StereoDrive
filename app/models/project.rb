class Project < ActiveRecord::Base
  has_many :tracks
  has_many :audio
  belongs_to :artist
end
