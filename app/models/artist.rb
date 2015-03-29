class Artist < ActiveRecord::Base
has_and_belongs_to_many :users
  attr_accessible :name, :image, :page, :location, :genre

  def self.clean(params)
    #params.delete("user")
    #params.delete("dob")
    params.delete("controller")
    params.delete("action")
    params.delete("id")
    return params
  end
end
