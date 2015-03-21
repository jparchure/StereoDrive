describe("Unit Testing Examples", function() {

 beforeEach(module("app"));

 var scope, createController, httpBackend;

 beforeEach(inject(function($controller, $injector) {
        scope = $injector.get('$rootScope').$new();
        httpBackend = $injector.get('$httpBackend');
        //console.log("HEllllo", $httpBackend);
        //console.log(httpBackend);
        httpBackend.when('GET', '/paytonleevieno').respond({
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
 
it('returns correct values', function() {
		//createController();
        //console.log("HEllllo", httpBackend);
        httpBackend.expectGET('/paytonleevieno');
        httpBackend.flush();
        console.log(scope);
        expect(scope.currentuser.name).toBe("John A. Doe");
        expect(scope.currentuser.image).toBe("image.jpg");
        expect(scope.currentuser.email).toBe("john@example.com");
    });
});