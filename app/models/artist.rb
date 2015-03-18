class Artist < ActiveRecord::Base
has_and_belongs_to_many :users
  attr_accessible :name, :image, :page, :location, :genre
  def self.create_artist! (hash)
	Artist.create!(hash)
  end

end
