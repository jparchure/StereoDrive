describe("Artist Controller Testing Examples", function() {

 beforeEach(module("app"));

 var scope, createController, httpBackend, testObject;

 beforeEach(inject(function($controller, $injector) {
        routeParams={id: "1"}
        scope = $injector.get('$rootScope').$new();
        httpBackend = $injector.get('$httpBackend');
        //console.log("HEllllo", $httpBackend);
        //console.log(httpBackend);
        

        ctrl = $injector.get('$controller')('artistCtrl', {
            $scope: scope,
            $routeParams: {id : "1"},
            $cookies: {id: "1"}
        });
        //$routeParams = routeParams;
        httpBackend.when('GET', '/artists/' + routeParams["id"]).respond({
            id: "1",
            name: "Hells Angels",
            image: "imagemad.jpg",
            page: "hellsangels.org"
          });
    }));
 it("should have a controller", function() {
 	expect('artistCtrl').toBeDefined();
 });
 
it('shows correct values', function() {
		//createController();
        scope.getArtistdata();
        
        //console.log("HEllllo", httpBackend);
        httpBackend.expectGET('/artists/' + routeParams["id"]).respond({});
        httpBackend.expectGET('/artist/member/' + routeParams["id"]).respond({});
    
        httpBackend.flush();
       //console.log(scope);
        
        expect(scope.artist.name).toBe("Hells Angels");
        expect(scope.artist.image).toBe("imagemad.jpg");
        expect(scope.artist.page).toBe("hellsangels.org");
    });

it('updates artists correctly', function(){
    scope.getArtistdata();
    console.log("C+ROUTE PARAMS" + scope.currentuser_id);
    httpBackend.expectGET('/artists/' + routeParams["id"]).respond({});
    httpBackend.expectGET('/artist/member/' + routeParams["id"]).respond({});
    httpBackend.flush();

    
	scope.artist.name= "Heavens Demons";
	scope.artist.image="imagecrazy.png";
	scope.artist.page="heavensdemons.org";
    //scope.saveUser();
	httpBackend.expectPUT('/artists/' + routeParams["id"]).respond({});
	

	httpBackend.whenGET('/artists/' + routeParams["id"]).respond({});
  
    expect(scope.artist.name).toBe("Heavens Demons");
    expect(scope.artist.image).toBe("imagecrazy.png");
    expect(scope.artist.page).toBe("heavensdemons.org");
	});
});

});

