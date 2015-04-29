class AddFieldtoArtists < ActiveRecord::Migration
  def change
  	add_column :artists, :is_solo, :boolean, :default => false
  end
end
