
app.controller("dawCtrl", ['$scope','$upload','$http', 'usSpinnerService', function($scope, $upload, $http, usSpinnerService) {

    $scope.audioFiles = [];

    $scope.$watch('file', function () {
        upload($scope.file);
    });

    var audioContext;
    var numOfLoadedSounds = 0;

    initializeAudioTools();
    getAudio();

    // This function will make the API call to get the audio files from our backend
    function getAudio() {
        $http.get('/audio').success(function (data) {
            for (var i = 0; i < data.length; i++) {
                $scope.audioFiles.push(loadSound(data[i]));
            }
            if (data.length == 0) {
                hideSpinner();
            }
        }).error(function () {
            alert("could not retrieve audio");
        });
    }

    function hideSpinner() {
        usSpinnerService.stop('spinner');
    }

    function showSpinner() {
        usSpinnerService.spin('spinner');
    }

    function loadSound(data) {
        var url = data.audioUrl;
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function (a) {
            audioContext.decodeAudioData(request.response, function (buffer) {
                data.buffer = buffer;
                console.log('sound is loaded: ' + buffer);
                numOfLoadedSounds++;
                if (numOfLoadedSounds == $scope.audioFiles.length) {
                    hideSpinner();
                }
            }, function (e) {
                alert("sounds were not loaded properly");
            });
        };
        request.send();
        return data;
    }

    $scope.sounds = 0;
    $scope.onSoundDrop = function(data, event){
        $scope.sounds++;
        element = document.getElementById("audioImg");
        drawWaveform(element.width,element.height,element.getContext("2d"),data.buffer)
    };

    function drawWaveform( width, height, context, buffer ) {
        var data = buffer.getChannelData( 0 );
        var step = Math.ceil( data.length / width );
        var amp = height / 2;
        for(var i=0; i < width; i++){
            var min = 1.0;
            var max = -1.0;
            for (var j=0; j<step; j++) {
                var datum = data[(i*step)+j];
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
        }
    }

    $scope.playSound = function (file) {
        if (file && file.buffer && file.file_name) {
            console.log("playing sound: " + file.file_name + "\nbuffer: " + file.buffer);
            var source = audioContext.createBufferSource();
            source.buffer = file.buffer;
            source.connect(audioContext.destination);
            source.start();
        }
        return false;
    };

    // This function will set up the WebAudioApi
    function initializeAudioTools() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
        } catch (e) {
            alert("This browser does not support our Audio tools");
        }
    }

    function upload(file) {
        if (file) {
            showSpinner();
            console.log("uploading file: " + file);
            $upload.upload({
                url: '/audio',
                file: file
            }).success(function (data, status, headers, config) {
                if (data.success) {
                    data = loadSound(data);
                    $scope.audioFiles.push(data);
                } else {
                    alert(data.error);
                    hideSpinner();
                }
            }).error(function () {
                hideSpinner();
                alert("file could not be uploaded");
            });
        } else {
            console.log("no file: " + file);
        }
    }


    //////////////////////////////////////////////

    $scope.tracks = [
        {number:1, name:"testTrack"}
    ];

    $scope.addTrack = function(){
        var track = {
            number: $scope.tracks.length+1,
            name: 'track #' //needs track number in there too
        };

        $http.post('/track', {track: track}).success(function(data){//data is returned from track_controller.rb#create

            $scope.tracks.push(track);
        }).error(function(data, status, headers, config){
            console.log(status);
            alert("could not add track");
        });

    };
    $scope.removeTrack = function(index){
        $http.post('/track#delete', track).success(function(data){//data is returned from track_controller.rb#create
            $scope.message = data;
            $scope.tracks.splice(index,1);
        }).error(function(data, status, headers, config){
            console.log(status);
            alert("could not add track");
        });

    };




}]);