class AddFacebookExtras < ActiveRecord::Migration
  def change
	add_column :users, :sex, :string
	add_column :users, :location, :string
	add_column :users, :page, :string
  end
end
