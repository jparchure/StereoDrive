class Project < ActiveRecord::Base
  has_many :tracks
  has_many :audio
  #has_and_belongs_to_many :collaborators
end
