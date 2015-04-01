class CreateTracks < ActiveRecord::Migration
  def change
    create_table :tracks do |t|
      t.integer 'project_id'
      t.timestamps null: false
    end
  end
end