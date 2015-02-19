class CreateAudios < ActiveRecord::Migration
  def change
    create_table :audios do |t|
      t.string :file_name
      t.string :key
      t.timestamps null: false
    end
  end
end
