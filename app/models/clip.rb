class Clip < ActiveRecord::Base
  belongs_to :audio
  belongs_to :track
end
