describe("Create Artist Controller Testing Examples", function() {

 beforeEach(module("app"));

 var scope,createController, httpBackend, testObject;

 beforeEach(inject(function($controller, $injector, $rootScope) {
        routeParams={id: "1"}
        httpBackend = $injector.get('$httpBackend');

        parent = $rootScope;
        pCtrl =  $injector.get('$controller')('homeCtrl', {
            $scope: parent,
            $routeParams: {id : "1"},
            $cookies: {id: "1"},
           
        });

        scope = parent.$new();
       // windowMock= {confirm: function(msg) {return true}};
        ctrl = $injector.get('$controller')('createArtistCtrl', {
            $scope: scope,
            $routeParams: {id : "1"},
            $cookies: {id: "1"},
           
        });
        //$routeParams = routeParams;
        httpBackend.when('GET', '/artist/list/' + routeParams["id"]).respond({
            id: routeParams["id"],
            name: "Hells Angels",
            image: "imagemad.jpg",
            page: "hellsangels.org"
          });
        httpBackend.when('GET', '/users/1/').respond({});
        //httpBackend.flush();
    }));
 it("should have a controller", function() {
    expect('createArtistCtrl').toBeDefined();
 });

it('creates artists correctly', function(){
    //var form = $("#userForm");
    form={$setPristine:function(){}, $pristine: false, $invalid:false,$setUntouched:function(){}};
    scope.userData.name= "Heavens Demons";
    scope.userData.image="imagecrazy.png";
    scope.userData.page="heavensdemons.org";

    scope.processForm(form);
    console.log("THE DATA IS:" + scope.userData.name);
    spyOn(window, 'confirm').and.returnValue(true);

    
    httpBackend.expectGET('/artist/list/1/').respond({});
    httpBackend.expectPOST('/artists', {name:"Heavens Demons",image:"imagecrazy.png",page:"heavensdemons.org"}).respond({});
    httpBackend.expectGET('/artist/list/1/').respond({});
    
    httpBackend.flush();

    
    });

});

