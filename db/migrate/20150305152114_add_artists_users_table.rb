class AddArtistsUsersTable < ActiveRecord::Migration
  def change
  	create_table :artists_users, id: false do |t|
		t.belongs_to :user, index: true
		t.belongs_to :artist, index: true
	end
  end
end
