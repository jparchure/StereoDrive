describe('Unit: dawCtrl', function() {
    // Load the module with MainController
    beforeEach(module("app"));

    var ctrl, scope, httpBackend, upload, spinner;
    //inject the $controller and $rootScope services
    //in the beforeEach block
    beforeEach(inject(function ($controller, $injector) {
        //Create a new scope that's a child of the $rootScope
        scope = $injector.get('$rootScope').$new();
        upload = $injector.get('$upload');
        spinner = $injector.get('usSpinnerService');
        // use to define backend calls
        httpBackend = $injector.get('$httpBackend');
        httpBackend.when('GET', '/audio').respond([]);
        httpBackend.when('GET', '/track').respond([{ key: '1'}]);

        ctrl = $injector.get('$controller')('dawCtrl', {
            $scope: scope,
            $upload: upload,
            usSpinnerService: spinner
        });
    }));
    describe('Audio', function(){
        it('should only play valid sounds',
            function () {
                expect(scope.playSound(null)).toBeFalsy();
            }
        );

        it('should upload file when a file is added', function () {
            httpBackend.expect('POST', '/audio').respond('{"success":"true"}');
            scope.file = {};
        });

        it('should hide the spinner if there are no audio files to be downloaded', function () {
            spinner.stop = jasmine.createSpy();
            httpBackend.flush();
            expect(spinner.stop).toHaveBeenCalled();
        });

        it('should hide the spinner once the audio files are downloaded', function () {
            var testurl = "/test";
            httpBackend.when('GET', '/audio').respond([{url: testurl}]);
            httpBackend.when('GET', testurl).respond({success: true});
            httpBackend.when('GET', '/track').respond([{success: true, id: '1'}]);
            spinner.stop = jasmine.createSpy();
            httpBackend.flush();
            expect(scope.audioFiles.length > 0);
            expect(spinner.stop).toHaveBeenCalled();
        });

        it('should fetch audio when page is loaded', function () {
            httpBackend.expect('GET', '/audio');
        });
    });
    describe('Clips', function(){
       it('should be able to add clips', function(){
           httpBackend.flush();
           scope.$apply();

           clip = {
               key: "key",
               buffer: {duration: 100},
               clip_id: "test",
               length: 100
           };
           scope.onSoundDrop(clip,{}, scope.tracks[0]);
           httpBackend.expect('POST', '/clips');
       });
    });
});