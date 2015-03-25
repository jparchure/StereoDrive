
app.controller("dawCtrl", ['$scope','$upload','$http', 'usSpinnerService', function($scope, $upload, $http, usSpinnerService) {

    $scope.audioFiles = [];
    var audioContext;
    var numOfLoadedSounds = 0;

    init();
    function init(){
        initializeAudioTools();
        getAudio();
        listenForFileDrop();
    }

    ///////////////////////////////////////////////////////////
    // Initialization Functions
    ///////////////////////////////////////////////////////////

    function listenForFileDrop(){
        $scope.$watch('file', function () {
            upload($scope.file);
        });
    }

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

    // This function will set up the WebAudioApi
    function initializeAudioTools() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
        } catch (e) {
            alert("This browser does not support our Audio tools");
        }
    }

    /////////////////////////////////////////////////////////
    //  Utility Functions
    /////////////////////////////////////////////////////////
    function hideSpinner() {
        usSpinnerService.stop('spinner');
    }

    function showSpinner() {
        usSpinnerService.spin('spinner');
    }


    /////////////////////////////////////////////////////////
    //  Project Functions
    /////////////////////////////////////////////////////////
    var playlist;

    $scope.play= function(){
      playlist = [];
      for(var i = 0; i<$scope.tracks.length; i++){
          var track = $scope.tracks[i];
          for( var j=0; j<track.clips.length; j++){
              var clip = track.clips[j];
              playlist.push({
                  buffer: clip.buffer,
                  pos_in_track: clip.pos_in_track/zoomCoefficient,
                  start: 0,
                  end: clip.buffer.duration
              })
          }
      }
      for(var i=0; i<playlist.length;i++){
          console.log("sound: "+1+", delay: "+playlist[i].pos_in_track);
          var index = i;
          setTimeout(function(index){
              console.log(playlist);
              console.log(index);
              var source = audioContext.createBufferSource();
              source.buffer = playlist[index].buffer;
              source.connect(audioContext.destination);
              source.start(playlist[index].pos_in_track, playlist[index].start, playlist[index].end)
          },playlist[i].pos_in_track*1000, index);

          //audioContext.decodeAudioData(playlist[i].buffer, function(buffer){
          //
          //        var audioSource = audioContext.createBufferSource();
          //        audioSource.buffer = buffer;
          //        audioSource.connect(audioContext.destination);
          //        audioSource.start(1000, 0, buffer.length);
          //    }
          //);
      }
    };

    ///////////////////////////////////////////
    // Audio Functions
    //////////////////////////////////////////
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

    $scope.deleteAudio = function(audioFile){
        $http.get('/audio/'+audioFile.key+'/delete').success(function(data){
            hideSpinner();
            var index = $scope.audioFiles.indexOf(audioFile);
            $scope.audioFiles.splice(index,1);
            console.log(data);
        }).error(function(data){
            hideSpinner();
        });
        showSpinner();
    };

    $scope.playFile = function(file){
        if(file && file.buffer && file.file_name){
            console.log("playing sound: " + file.file_name + "\nbuffer: " + file.buffer);
            $scope.playSound(file.buffer);
            return true;
        }
        return false;
    };

    $scope.playSound = function (buffer) {
        var source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start();
        return false;
    };

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
    // Track Functions
    //////////////////////////////////////////////

    $scope.tracks = [
        {number:1, name:"track1", clips:[]}
    ];

    $scope.addTrack = function(){
        var track = {
            number: $scope.tracks.length+1,
            name: 'track'+($scope.tracks.length+1), //needs track number in there too
            clips: []
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

    /////////////////////////////////////////////
    // Clip Functions
    /////////////////////////////////////////////
    var zoomCoefficient = 100;
    $scope.onSoundDrop = function(data, event, track){

        var clip = {
            audio_key: data.key,
            pos_in_track: 0,
            start: 0,
            end: 0,
            clip_id: track.name+"-clip"+track.clips.length,
            width: data.buffer.duration * zoomCoefficient,
            buffer: data.buffer
        };

        track.clips.push(clip);
        $scope.$apply();
        createNewClip(clip, track);
        attachSlider(clip);
        element = document.getElementById(clip.clip_id);
        drawWaveform(element.width,element.height,element.getContext("2d"),data.buffer);
        //setNewClipPosition(clip, 0);
    };

    function createNewClip(clip, track){
        var data = {
            clip: clip,
            track: track
        };
        $http.post('/clips', data).success(function(data){
            if(data.success){
                console.log("success\n"+JSON.stringify(data));
            }
            else{
                console.log("failure");
            }

        }).error(function(data){
            console.log("error");
        });
    }

    function attachSlider(clip){
        interact('#'+clip.clip_id)                   // target the matches of that selector
            .resizable({
                left: true,
                right: true,
                top: false,
                bottom: false
            })
            .draggable({                        // make the element fire drag events
                max: Infinity,                     // allow drags on multiple elements
                restrict: {
                    restriction: "parent", // keep the drag within the parent
                    endOnly: false,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                },
                inertia: false,
                onmove: function (event) {
                    var target = event.target;

                    // keep the dragged position in the posInTrack attribute
                    x = (parseFloat(clip.pos_in_track || 0) + event.dx );
                    //x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    x = x - (x%1);
                    // translate the element
                    target.style.transform = 'translate(' + x + 'px, ' + 0 + 'px)';

                    // update the posiion attributes
                    clip.pos_in_track = x;
                },
                onend: function(event) {
                    $scope.$apply();
                }
            });

        interact.maxInteractions(Infinity);   // Allow multiple interactions
    }

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

    function setNewClipPosition(clip, nPosX){
        console.log("chagning clip Pos");
        var target = document.getElementById(clip.id);
        var dx = nPosX - clip.pos_in_track;
        clip.pos_in_track = nPosX;
        target.style.transform = 'translate(' + dx + 'px, ' + 0 + 'px)';
        $scope.$apply();
    }
}]);