
app.controller("dawCtrl", ['$scope','$upload','$http',function($scope, $upload, $http){

    $scope.audioFiles = [{file_name: "test!"}];
    $scope.$watch('rejectedFiles', function(){
        if($scope.rejectedFiles)
            alert("Only .mp3 files are supported");
    });
    $scope.$watch('file', function () {
        upload($scope.file);
    });
    var audioContext;

    initializeAudioTools();
    getAudio();

    loadSound({
        url: 'assets/test.mp3'
    });
    // This function will make the API call to get the audio files from our backend
    function getAudio(){
        $http.get('/audio').success(function(data){
            $scope.message = data;
            for(var i=0; i<data.length;i++){
                $scope.audioFiles.push(loadSound(data[i]));
            }
        }).error(function(){
            alert("could not retrieve audio");
        });
    }

    function loadSound(data){
        var url = data.url;
        var request = new XMLHttpRequest();
        request.open('GET',url,true);
        request.responseType = 'arraybuffer';

        request.onload = function(a){
            alert(request.response);
            audioContext.decodeAudioData(request.response, function(buffer) {
                data.buffer = buffer;
                alert('sound is loaded');
            }, function(e){
                alert("sound was not loaded: "+ e);
            });
        };
        request.send();
        return data;
    }

    $scope.playSound = function(buffer){
        alert("hey I felt that");
        var source = audioContext.createBufferSource();
        source.buffer = buffer;
        sources.connect(audioContext.destination);
        source.start(0);
    };

    // This function will set up the WebAudioApi
    function initializeAudioTools(){
        try{
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            audioContext = new AudioContext();
        }catch(e){
            alert("This browser does not support our Audio tools");
        }
    }

    function upload(file){
        if (file) {
            $upload.upload({
                url: '/audio',
                file: file
            }).success(function (data, status, headers, config) {
                $scope.message = data;
                $scope.audioFiles.push(data);
            }).error(function (){
                alert("file could not be uploaded");
            });
        }
    }


}]);