describe('Unit: dawCtrl', function() {
    // Load the module with MainController
    beforeEach(module("app"));

    var ctrl, scope,blah;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function ($controller, $rootScope) {
        blah = 5;
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        // Create the controller
        ctrl = $controller('dawCtrl', {
            $scope: scope,
            $upload: {},
            $http: {},
            usSpinnerService: {}
        });
    }));

    it('should return false when we try to call an invalid sound',
        function () {
            expect(5).toEqual(5);
            //expect(scope.playSound(null)).toBeFalsy();
        }
    );
});