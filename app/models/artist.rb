class Artist < ActiveRecord::Base
has_and_belongs_to_many :users
  attr_accessible :name, :image, :page, :location, :genre
end
