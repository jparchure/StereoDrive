class AddTrackToProject < ActiveRecord::Migration
  def change
    add_column :tracks, :project_id, :integer, index:true
  end
end
