module OmniauthMacros
 
 def facebook_hash
 OmniAuth.config.mock_auth[:facebook] = OmniAuth::AuthHash.new({
   "provider"=>"facebook",
   "uid"=>"123545",
   "info" =>OmniAuth::AuthHash::InfoHash.new({
     "email" => "example_facebook@xyze.it",
     "name" => "Test",
     "first_name"=>"Test",
     "last_name" => "User",
     "image" => "picture",
     "urls" =>OmniAuth::AuthHash::InfoHash.new({
	"facebook"=> "link_to_facebook"
	}),
      }),
     "extra" =>OmniAuth::AuthHash::InfoHash.new({
	   "raw_info" =>OmniAuth::AuthHash::InfoHash.new({
	     "location" => "Right Here",
	     "gender" => "male"
		})
     }),
     "credentials" =>OmniAuth::AuthHash::InfoHash.new({
	"token"=> "fake_token"
	}),
  })
 end
end
