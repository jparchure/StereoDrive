OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, 1561070874149103, "fb888d95834812358107a06095a00c14"
  #:scope => 'email,public_profile,user_friends,publish_actions,manage_pages,status_update'
  #callback_url  => this will default to our profile page eventually

end
