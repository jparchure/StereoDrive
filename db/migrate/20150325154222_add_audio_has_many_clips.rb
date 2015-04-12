class AddAudioHasManyClips < ActiveRecord::Migration
  def change
    add_column :clips, :audio_id, :integer, index:true
  end
end
