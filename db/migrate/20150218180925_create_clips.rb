class CreateClips < ActiveRecord::Migration
  def change
    create_table :clips do |t|
      t.belongs_to :track, index:true
      t.integer :pos_in_track
      t.integer :start
      t.integer :end
      t.string :clip_id
      t.string :audio_key
      t.timestamps null: false
    end
  end
end
