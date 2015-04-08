
app.controller("dawCtrl", ['$scope','$upload','$http', 'usSpinnerService', function($scope, $upload, $http, usSpinnerService) {

    $scope.audioFiles = [];
    $scope.zoomCoefficient = 50;
    var audioContext;
    var numOfLoadedSounds = 0;

    init();
    function init(){
        initializeAudioTools();
        getAudioAndClips();
        getTrack();
        listenForFileDrop();
        initDragMarker();
    }

    ///////////////////////////////////////////////////////////
    // Initialization Functions
    ///////////////////////////////////////////////////////////

    function listenForFileDrop(){
        $scope.$watch('file', function () {
            upload($scope.file);
        });
    }

    function initDragMarker(){
        interact('#drag-marker')                   // target the matches of that selector
            .draggable({                        // make the element fire drag events
                max: Infinity,                     // allow drags on multiple elements
                restrict: {
                    restriction: "parent", // keep the drag within the parent
                    endOnly: false,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 0.3}
                },
                inertia: false,
                onmove: function (event) {
                    var target = event.target;

                    // keep the dragged position in the posInTrack attribute
                    var x = (parseFloat($scope.markerPos || 0) + event.dx );
                    //x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    x = x - (x%1);
                    // translate the element
                    if(x<0)
                        x = 0;

                    elements = document.getElementsByClassName("marker");
                    for(var i=0; i<elements.length; i++){
                        elements[i].style.transform = 'translate(' + x + 'px, ' + 0 + 'px)';
                    }

                    target.style.transform = 'translate(' + x + 'px, ' + 0 + 'px)';

                    // update the posiion attributes
                    $scope.markerPos = x;
                },
                onend: function(event) {
                    $scope.$apply();
                }
            });

        interact.maxInteractions(Infinity);   // Allow multiple interactions
    }

    // This function will make the API call to get the audio files from our backend
    function getAudioAndClips() {
        $http.get('/audio').success(function (data) {
            for (var i = 0; i < data.length; i++) {
                $scope.audioFiles.push(loadSoundAndClips(data[i]));
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
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
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

    $scope.markerPos = 0;

    function animateMarker(){
        if(playing && parseFloat($(".marker").css("left")) < $("#drag-marker-container").width()) {
            var leftVal = "+=" + $scope.zoomCoefficient/5;

            $(".marker").animate({
                left: leftVal
            }, 200, "linear");

            $("#drag-marker").animate({
                left: leftVal
            }, 200, "linear", function () {
                animateMarker();
            });
        }
        else{
            playing = false;
            $(".marker").css({left:0});
            $("#drag-marker").css({left:0});
        }
    }

    var playing = false;

    $scope.play= function(){
      playlist = [];
      for(var i = 0; i<$scope.tracks.length; i++){
          var track = $scope.tracks[i];
          for( var j=0; j<track.clips.length; j++){
              var clip = track.clips[j];
              playlist.push({
                  buffer: clip.buffer,
                  when: clip.pos_in_track/$scope.zoomCoefficient,
                  start: 0,
                  end: clip.buffer.duration
              })
          }
      }
      playing = true;
      for(var i=0; i<playlist.length;i++) {
          console.log("sound: " + i + ", delay: " + playlist[i].when);
          var index = i;
          setTimeout(function (index) {
              var source = audioContext.createBufferSource();
              source.buffer = playlist[index].buffer;
              source.connect(audioContext.destination);
              source.start(2);//playlist[index].pos_in_track, playlist[index].start, playlist[index].end)
          }, playlist[i].when * 1000, index);

          //audioContext.decodeAudioData(playlist[i].buffer, function(buffer){
          //
          //        var audioSource = audioContext.createBufferSource();
          //        audioSource.buffer = buffer;
          //        audioSource.connect(audioContext.destination);
          //        audioSource.start(1000, 0, buffer.length);
          //    }
          //);
      }
      animateMarker();
    // Get the right width/time vals and ratio
    };

    $scope.createProject = function(){
        $http.post('/project' ).success(function(data){//data is returned from track_controller.rb#create

            console.log(data)
        }).error(function(data, status, headers, config){
            console.log(status);
            alert("could not create project");
        });
    }
    ///////////////////////////////////////////
    // Audio Functions
    //////////////////////////////////////////
    function loadSoundAndClips(data) {
        var url = data.audioUrl;
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function (a) {
            audioContext.decodeAudioData(request.response, function (buffer) {
                data.buffer = buffer;
                console.log('sound is loaded: ' + buffer);
                numOfLoadedSounds++;
                if(data.clips) {
                    for (var i = 0; i < data.clips.length; i++) {
                        var clip = data.clips[i];
                        clip.length = buffer.duration;
                        clip.buffer = buffer;

                        var trackIndex = -1;
                        for (var j = 0; j < $scope.tracks.length; j++) {
                            if ($scope.tracks[j].key == clip.track_id) {
                                trackIndex = j;
                                j = $scope.tracks.length;
                            }
                        }
                        if (trackIndex != -1) {
                            $scope.tracks[trackIndex].clips.push(clip);
                            $scope.$apply();
                            attachSlider(clip);
                            element = document.getElementById(clip.clip_id);
                            drawWaveform(element.width, element.height, element.getContext("2d"), data.buffer);
                            initClipPos(clip);
                            console.log("added clip to track: " + clip.clip_id);
                        }
                    }
                }

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
                    data = loadSoundAndClips(data);
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

    $scope.tracks = [];

    $scope.addTrack = function(){
        var track = {
            number: $scope.tracks.length+1,
            name: 'track'+($scope.tracks.length+1), //needs track number in there too
            key: 0,
            clips: []
        };
        $http.post('/track', {track: track}).success(function(data){//data is returned from track_controller.rb#create

            track.key = data.key;
            track.name = 'track'+(track.key);
            console.log(track);
            $scope.tracks.push(track);
        }).error(function(data, status, headers, config){
            console.log(status);
            alert("could not add track");
        });
    };
    $scope.removeTrack = function(deleteTrack){
        var index;
        for (var i =0; i < $scope.tracks.length; i++)
            if ($scope.tracks[i].key === deleteTrack.key) {
                index = i;
                break;
            }
        console.log(index);
        $http.post('/deleteTrack', {track:deleteTrack}).success(function(data){//data is returned from track_controller.rb#create

            $scope.message = data;
            for (var i =0; i < $scope.tracks.length; i++)
                if ($scope.tracks[i].key === deleteTrack.key) {
                    $scope.tracks.splice(i,1);
                    break;
                }
        }).error(function(data, status, headers, config){
            console.log(status);
            alert("could not delete track");
        });
    };
    // This function will make the API call to get the track files from our backend
    function getTrack() {
        $http.get('/track').success(function (data) {
            for (var i = 0; i < data.length; i++) {
                var track = {number:0, name:"", key: 0, clips: []};
                data[i].clips = [];
                $scope.tracks.push(data[i]);
            }
        }).error(function () {
            alert("could not retrieve tracks");
        });
    }

    /////////////////////////////////////////////
    // Clip Functions
    /////////////////////////////////////////////
    $scope.onSoundDrop = function(data, event, track){
        //console.log(event);
        var clip = {
            audio_key: data.key,
            pos_in_track: 0,
            start: 0,
            end: 0,
            clip_id: "t"+track.key+"-clip"+track.clips.length,
            length: data.buffer.duration,
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
                console.log("success");
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
                    if(x<0)
                        x=0;
                    // translate the element
                    target.style.transform = 'translate(' + x + 'px, ' + 0 + 'px)';

                    // update the posiion attributes
                    clip.pos_in_track = x;
                },
                onend: function(event) {
                    $scope.$apply();
                    updateClipModel(clip);
                }
            });

        interact.maxInteractions(Infinity);   // Allow multiple interactions
    }

    function updateClipModel(clip){
        $http.post("/clips/"+clip.clip_id, {clip: clip}).success(function(data){
            console.log("success: "+data.success);
        }).error(function(){
            console.log("error");
        })
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

    function initClipPos(clip){
        var target = document.getElementById(clip.clip_id);
        target.style.transform = 'translate(' + clip.pos_in_track + 'px, ' + 0 + 'px)';
        $scope.$apply();
    }

    function setNewClipPosition(clip, nPosX){
        console.log("chagning clip Pos");
        var target = document.getElementById(clip.clip_id);
        var dx = nPosX - clip.pos_in_track;
        clip.pos_in_track = nPosX;
        target.style.transform = 'translate(' + dx + 'px, ' + 0 + 'px)';
        $scope.$apply();
    }
}]);