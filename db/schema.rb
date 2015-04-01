# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150326213210) do

  create_table "artists", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "name"
    t.string   "image"
    t.string   "page"
    t.string   "location"
    t.string   "genre"
    t.string   "tagline"
  end

  create_table "artists_users", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "artist_id"
  end

  add_index "artists_users", ["artist_id"], name: "index_artists_users_on_artist_id"
  add_index "artists_users", ["user_id"], name: "index_artists_users_on_user_id"

  create_table "audios", force: :cascade do |t|
    t.string   "file_name"
    t.string   "key"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "clips", force: :cascade do |t|
    t.integer  "pos_in_track"
    t.integer  "start"
    t.integer  "end"
    t.string   "clip_id"
    t.string   "audio_key"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "track_id"
    t.integer  "audio_id"
  end

  create_table "projects", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tracks", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "provider"
    t.string "uid"
    t.string "email"
    t.string "name"
    t.string "first_name"
    t.string "image"
    t.string "token"
    t.string "session"
    t.string "sex"
    t.string "location"
    t.string "page"
    t.string "tagline"
  end

end
