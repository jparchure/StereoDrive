class AddFieldstoArtists < ActiveRecord::Migration
  def change
    add_column :artists, :name, :string
    add_column :artists, :image, :string
    add_column :artists, :page, :string
    add_column :artists, :location, :string
    add_column :artists, :genre, :string
    add_column :artists, :tagline, :string
  end
end
