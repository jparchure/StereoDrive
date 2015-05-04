FactoryGirl.define do
  factory :user do
    #skip_create

    #transient do
      name 'John A Doe'
      first_name 'Doe'
      id '1'
      location 'U.S'
      email "john@exampl.com"
    #end

  end
end
