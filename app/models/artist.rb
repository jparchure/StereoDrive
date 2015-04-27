class Artist < ActiveRecord::Base
has_and_belongs_to_many :users
  attr_accessible :name, :image, :page, :location, :genre, :tagline, :is_solo

  def self.clean(params)
    params=params['artist']
    return params
  end
end
