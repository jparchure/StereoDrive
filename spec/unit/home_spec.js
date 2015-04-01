describe("Home controller Unit Testing Examples", function() {

 beforeEach(module("app"));

 var scope, createController, httpBackend, testObject;

 beforeEach(inject(function($controller, $injector) {
        scope = $injector.get('$rootScope').$new();
        httpBackend = $injector.get('$httpBackend');
        //console.log("HEllllo", $httpBackend);
        //console.log(httpBackend);
        httpBackend.when('GET', '/users').respond({
        	id: "1"
            name: "John A. Doe",
            image: "image.jpg",
            email: "john@example.com"
          });

        ctrl = $injector.get('$controller')('homeCtrl', {
            $scope: scope
        });
    }));
 it("should have a controller", function() {
 	expect('homeCtrl').toBeDefined();
 });
 
it('shows correct values', function() {
		//createController();
        //console.log("HEllllo", httpBackend);
        httpBackend.expectGET('/users');
        httpBackend.flush();
       //console.log(scope);
        
        expect(scope.currentuser.name).toBe("John A. Doe");
        expect(scope.currentuser.image).toBe("image.jpg");
        expect(scope.currentuser.email).toBe("john@example.com");
    });

it('updates users correctly', function(){
	var temp = scope.saveUser();
	scope.currentuser.name= "Jana A Ley";
	scope.currentuser.image="image2.png";
	scope.currentuser.email="jana@example.org";
	httpBackend.expectPUT('/users/' + currentuser.id);
	httpBackend.flush();

	httpBackend.whenGET('/users');
    httpBackend.flush();
    expect(scope.currentuser.name).toBe("Jana A Ley");
    expect(scope.currentuser.image).toBe("image2.png");
    expect(scope.currentuser.email).toBe("jana@example.org");
	});
});

