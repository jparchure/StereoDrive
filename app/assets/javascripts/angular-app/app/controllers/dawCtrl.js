
app.controller("dawCtrl", ['$scope','$upload','$http',function($scope, $upload, $http){

    $scope.audioFiles = [{fileName: "test!"}];
    $scope.$watch('rejectedFiles', function(){
        if($scope.rejectedFiles)
            alert("Only .mp3 files are supported");
    });
    $scope.$watch('file', function () {
        upload($scope.file);
    });
    var audioContext;

    getAudio();
    initializeAudioTools();

    // This function will make the API call to get the audio files from our backend
    function getAudio(){
        $http.get('/audio').success(function(data){
            $scope.message = data;
            for(var i=0; i<data.length;i++){
                $scope.audioFiles.push({fileName: data[i].file_name});
            }
        }).error(function(){
            alert("could not retrieve audio");
        });
    }
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
                $scope.audioFiles.push(file);
            }).error(function (){
                alert("file could not be uploaded");
            });
        }
    }


}]);