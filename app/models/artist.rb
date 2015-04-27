class Artist < ActiveRecord::Base
has_and_belongs_to_many :users
has_many :projects
  attr_accessible :name, :image, :page, :location, :genre, :tagline, :is_solo

  def self.clean(params)
    #params.delete("user")
    #params.delete("dob")
 	puts(params['tagline'])
    params=params['artist']
   
    return params
  end
end
