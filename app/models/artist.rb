class Artist < ActiveRecord::Base
has_and_belongs_to_many :users
  attr_accessible :name, :image, :page, :location, :genre, :tagline

  def self.clean(params)
    #params.delete("user")
    #params.delete("dob")
 	puts(params['tagline'])
    params=params['artist']
   
    return params
  end
end
