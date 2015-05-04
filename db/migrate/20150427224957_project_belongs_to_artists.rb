class ProjectBelongsToArtists < ActiveRecord::Migration
  def change
    add_reference :projects, :artist, index: true, foreign_key: true
  end
end
