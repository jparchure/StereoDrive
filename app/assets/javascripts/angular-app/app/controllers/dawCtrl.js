
app.controller("dawCtrl", ['$scope','$upload','$http', 'usSpinnerService', function($scope, $upload, $http, usSpinnerService) {

    $scope.audioFiles = [];
    $scope.zoomCoefficient = 100;
    var audioContext;
    var numOfLoadedSounds = 0;

    init();
    function init(){
        getProject(1);
        initializeAudioTools();
        getAudioAndClips();
        //getTrack();
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

                    var transform = "+=" + (event.dx - (event.dx%1));
                    $(".marker").css({left: transform});
                    $("#drag-marker").css({left: transform});
                },
                onend: function(event) {
                    $scope.$apply();
                    console.log("track width: "+$(".track").width()+"\nmarker-container left: "+$("#drag-marker").css("left")+"\nwidth: "+$("#drag-marker-container").width());
                }
            });

        interact.maxInteractions(Infinity);   // Allow multiple interactions
    }

    // This function will make the API call to get the audio files from our backend
    function getAudioAndClips() {
        $http.get('/audio').success(function (data) {
            console.log(data);
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

    function animateMarker(){
        if(playing && parseFloat($(".marker").css("left")) < ($("#drag-marker-container").width()+25)) {
            //var leftVal = "+=" + $scope.zoomCoefficient/0.2;
            var distance = ($("#drag-marker-container").width() - parseFloat($(".marker").css("left"))) +25;
            var time = distance/$scope.zoomCoefficient;
            var position = "+=" + distance;
            $(".marker").animate({
                left: position
            }, time*1000, "linear");

            $("#drag-marker").animate({
                left: position
            }, time*1000, "linear", function(){
                $(".marker").css({left: 0});
                $("#drag-marker").css({left: 0});
            });
        }
        else{
            playing = false;

            if (parseFloat($(".marker").css("left")) >= $("#drag-marker-container").width()) {
                $(".marker").css({left: 0});
                $("#drag-marker").css({left: 0});
            }
        }
    }

    var playing = false;

    $scope.stop= function(){
        for(var i=0; i<playlist.length; i++){
            try {
                playlist[i].source.stop();
            }catch(e) {
                clearTimeout(playlist[i].timeout);
            }
        }
        playing = false;
        $(".marker").stop(true);
        $("#drag-marker").stop(true);
        $(".marker").css({left: 0});
        $("#drag-marker").css({left: 0});
        console.log("Stop Clicked");
    };

    $scope.pause = function(){
        for(var i=0; i<playlist.length; i++){
            try {
                playlist[i].source.stop();
            }catch(e) {
                clearTimeout(playlist[i].timeout);
            }
        }
        playing = false;
        $(".marker").stop(true);
        $("#drag-marker").stop(true);
    };

    $scope.play= function(){
      playlist = [];
      var markerPos = parseFloat($("#drag-marker").css("left"));
      for(var i = 0; i<$scope.tracks.length; i++){
          var track = $scope.tracks[i];
          for( var j=0; j<track.clips.length; j++){
              var clip = track.clips[j];
              var start = (markerPos - clip.pos_in_track)/$scope.zoomCoefficient;
              if(start<0){
                  start = 0;
              }
              playlist.push({
                  buffer: clip.buffer,
                  when: (clip.pos_in_track - markerPos)/$scope.zoomCoefficient,
                  start: start,
                  end: clip.buffer.duration
              })
          }
      }
      playing = true;
      for(var i=0; i<playlist.length;i++) {
          console.log("sound: " + i + ", delay: " + playlist[i].when);
          var index = i;
          playlist[i].source =  audioContext.createBufferSource();
          playlist[i].source.buffer = playlist[i].buffer;
          playlist[i].source.connect(audioContext.destination);

          playlist[i].timeout = setTimeout(function (index) {
              playlist[index].source.start(0,playlist[index].start);//playlist[index].pos_in_track, playlist[index].start, playlist[index].end)
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

            console.log(data);
        }).error(function(data, status, headers, config){
            console.log(status);
            alert("could not create project");
        });
    }
    function getProject(id){
        $http.get('/project/'+id).success(function(data){

            for (var i = 0; i < data.tracks.length; i++) {
                //var track = {number:0, name:"", key: 0, clips: []};
                data.tracks[i].clips = [];
                $scope.tracks.push(data.tracks[i]);
            }
            console.log(data);


        }).error(function(data,status,headers,config){

            alert("error. could not fetch projects");
        })

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
        if(buffer) {
            var source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start();
            return true;
        }
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
                    hideSpinner();
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
        if(element)
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