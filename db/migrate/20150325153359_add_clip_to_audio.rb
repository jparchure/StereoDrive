class AddClipToAudio < ActiveRecord::Migration
  def change
    def change
      add_column :clips, :audio_id, :integer, index:true
    end
  end
end
