class AddClipsToTracks < ActiveRecord::Migration
  def change
    add_column :clips, :track_id, :integer, index:true
  end
end
