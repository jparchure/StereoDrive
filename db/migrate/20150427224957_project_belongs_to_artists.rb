class ProjectBelongsToArtists < ActiveRecord::Migration
  def change
    add_reference :projects, :artists, index: true, foreign_key: true
  end
end
