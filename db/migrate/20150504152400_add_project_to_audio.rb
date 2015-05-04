class AddProjectToAudio < ActiveRecord::Migration
  def change
    add_column :audios, :project_id, :integer, index:true
  end
end
