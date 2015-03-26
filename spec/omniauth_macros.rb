module OmniauthMacros
 
 def facebook_hash
 OmniAuth.config.mock_auth[:facebook] = OmniAuth::AuthHash.new({
   "provider"=>"facebook",
   "uid"=>"123545",
   "info" =>OmniAuth::AuthHash::InfoHash.new({
     "email" => "example_facebook@xyze.it",
     "name" => "Alberto Pellizzon",
     "first_name"=>"Alberto",
     "last_name" => "Pellizzon"})
  })
 end
end
