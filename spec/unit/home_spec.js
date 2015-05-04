describe("Home controller Unit Testing Examples", function() {

 beforeEach(module("app"));

 var scope, createController, httpBackend, testObject;

 beforeEach(inject(function($controller, $injector) {
        scope = $injector.get('$rootScope').$new();
        httpBackend = $injector.get('$httpBackend');
        cookies={id:"1"};

        httpBackend.when('GET', '/users/1/').respond({
        	id: "1",
            name: "John A. Doe",
            image: "image.jpg",
            email: "john@example.com"
          });

        httpBackend.when('GET', '/artist/list/1/').respond([{
            id: "1",
            name: "John A. Doe's Band",
            image: "image1.jpg",
            genre: "Metal",
            location: "Nowhere"
          },
          {
            id: "2",
            name: "Hell's Fury",
            image: "image5.jpg",
            genre: "Rock",
            location: "Athens, Greece"
          }]);


        ctrl = $injector.get('$controller')('homeCtrl', {
            $scope: scope,
            $cookies: cookies,
        });
        

    }));

 it("should have a controller", function() {
 	expect('homeCtrl').toBeDefined();
 });
 
it('shows correct user values', function() {

        scope.getUserData();
        httpBackend.expectGET('/users/1/').respond({});
        httpBackend.flush();

        expect(scope.currentuser.name).toBe("John A. Doe");
        expect(scope.currentuser.image).toBe("image.jpg");
        expect(scope.currentuser.email).toBe("john@example.com");
    });

it('shows all artist values', function(){
    scope.getArtistData();
    httpBackend.expectGET('/artist/list/1/').respond({});
    httpBackend.flush();

    
    expect(scope.artistList[0].name).toBe("John A. Doe's Band");
    expect(scope.artistList[0].image).toBe("image1.jpg");
    expect(scope.artistList[0].genre).toBe("Metal");
    expect(scope.artistList[0].location).toBe("Nowhere");
});

it('updates users correctly', function(){

    httpBackend.expectGET('/users/1/').respond({});
    httpBackend.expectGET('/artist/list/1/').respond({});
    httpBackend.flush();
    scope.currentuser.name= "Jana A Ley";
    scope.currentuser.image="image2.png";
    scope.currentuser.email="jana@example.org";
   
	httpBackend.expectPUT('/users/' + scope.currentuser.id).respond({});;
	

	httpBackend.whenGET('/users/1/').respond({});
    
    expect(scope.currentuser.name).toBe("Jana A Ley");
    expect(scope.currentuser.image).toBe("image2.png");
    expect(scope.currentuser.email).toBe("jana@example.org");
	});

it('deletes user correctly if delete mode is on',function(){
    scope.artistEdit=true;
    console.log(cookies.id);
    var deleteEvent= {currentTarget:{id:"2"} };
    scope.artistAction(deleteEvent);
    spyOn(window, 'confirm').and.returnValue(true);
    httpBackend.expectDELETE("/artist/2").respond({});
});

});

