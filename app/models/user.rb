class User < ActiveRecord::Base
  attr_accessible :provider, :uid, :email, :name, :first_name, :image, :token, :session, :page, :sex, :location
  before_save { self.email = email.downcase }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, length: { maximum: 255 },format: { with: VALID_EMAIL_REGEX }
  
  has_and_belongs_to_many :artists

  def self.omniauth(auth)
      where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.email = auth.info.email
      user.name = auth.info.name
      user.first_name = auth.info.first_name
      user.location = auth.info.location
      user.sex = auth.extra.raw_info.gender
      user.page = auth.info.urls.facebook
      user.image = auth.info.image + "?type=large"
      user.token = auth.credentials.token
      user.session = SecureRandom.base64
    end
  end


  def self.create_user! (hash)
    session = SecureRandom.base64
    uid = SecureRandom.uuid + hash[:user_id]
    hash[:session]= session
    hash[:uid] = uid
    hash[:name] = hash[:user_id]
    User.create!(hash)
  end
end
