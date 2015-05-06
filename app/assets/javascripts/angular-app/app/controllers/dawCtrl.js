app.controller("dawCtrl", ['$scope','$routeParams','$upload','$http', 'usSpinnerService', '$firebaseArray', '$firebaseObject', '$timeout', function($scope, $routeParams, $upload, $http, usSpinnerService, $firebaseArray, $firebaseObject, $timeout) {

    $scope.audioFiles = [];
    $scope.zoomCoefficient = 100;

    $scope.$watch('zoomCoefficient',function(){
        refreshClipsAfterZoom();
    });
    var audioContext;
    var numOfLoadedSounds = 0;
    var projectId = $routeParams['id'];

    function init(){
        showSpinner();
        getProject(projectId);
        initializeAudioTools();
        //getAudioAndClips();
        //getTrack();
        listenForFileDrop();
        initDragMarker();
        setUpFirebase();
    }

    ///////////////////////////////////////////////////////////
    // Initialization Functions
    ///////////////////////////////////////////////////////////
    var trackState;
    var audioState;

    function setUpFirebase(){
        ref2  = new Firebase("https://flickering-fire-6049.firebaseio.com/1/");
        $scope.firebaseObj = $firebaseObject(ref2);

        trackState = $scope.firebaseObj.trackUpdates;
        audioState = $scope.firebaseObj.audioUpdates;
    }

    function watchFirebaseVars(){
        $timeout(function(){
            $scope.$watch('firebaseObj.trackUpdates', function(){
                console.log("detected Change");
                handleFirebaseUpdate();
            });

            $scope.$watch('firebaseObj.audioUpdates', function(){
                console.log("detected Change");
                handleFirebaseUpdate();
            });
        });
    }

    function handleFirebaseUpdate(){
        if( trackState != $scope.firebaseObj.trackUpdates)
            $scope.refreshTracks();

        if( audioState != $scope.firebaseObj.audioUpdates)
            $scope.refreshAudio();

        trackState = $scope.firebaseObj.trackUpdates;
        audioState = $scope.firebaseObj.audioUpdates;
    }

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
	    console.log("spinner hidden");
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
        if(playlist) {
            for (var i = 0; i < playlist.length; i++) {
                try {
                    playlist[i].source.stop();
                } catch (e) {
                    clearTimeout(playlist[i].timeout);
                }
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
        if(playlist) {
            for (var i = 0; i < playlist.length; i++) {
                try {
                    playlist[i].source.stop();
                } catch (e) {
                    clearTimeout(playlist[i].timeout);
                }
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
                  when: (clip.pos_in_track/100 - markerPos/$scope.zoomCoefficient),
                  start: start,
                  end: clip.buffer.duration
              })
          }
      }
      playing = true;
      for(var i=0; i<playlist.length;i++) {
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
    };

    function getProject(id){
        $http.get('/project/'+id).success(function(data){

            for (var i = 0; i < data.tracks.length; i++) {
                //var track = {number:0, name:"", key: 0, clips: []};
                data.tracks[i].clips = [];
                $scope.tracks.push(data.tracks[i]);
            }
            if(data.audio.length == 0){
                hideSpinner();
            }
            for (var i = 0; i < data.audio.length; i++) {
                $scope.audioFiles.push(loadSoundAndClips(data.audio[i]));
            }
        }).error(function(data,status,headers,config){

            alert("error. could not fetch projectssss");
        })

    }
    ///////////////////////////////////////////
    // Audio Functions
    //////////////////////////////////////////

    $scope.refreshAudio = function() {
        console.log("refreshing Audio");
        $http.get('/p/'+projectId+'/audio').success(function (data) {
            console.log(data);
            for(var i = 0; i<data.length;i++){
                var index = -1;
                for(var j=0; j<$scope.audioFiles.length; j++){
                    if($scope.audioFiles[j].key == data[i].key){
                        index = j;
                    }
                }
                if(index == -1){
                    console.log("new audio found. downloading...");
                    $scope.audioFiles.push(loadSoundAndClips(data[i]));
                }
            }

            for(var i = 0; i<$scope.audioFiles.length;i++) {
                var audioDeleted = true;
                for (var j = 0; j < data.length; j++) {
                    if ($scope.audioFiles[i].key == data[j].key) {
                        audioDeleted = false;
                    }
                }
                if (audioDeleted){
                    $scope.audioFiles.splice(i, 1);
                    i--;
                }
            }
        }).error(function () {
            alert("could not refresh audio");
        });
    };

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
                            // If track does not already contain the clip
                            if( $scope.tracks[trackIndex].clips.indexOf(clip) == -1 ) {
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
                }

                if (numOfLoadedSounds == $scope.audioFiles.length) {
                    hideSpinner();
                    watchFirebaseVars();
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

            audioState++;
            $scope.firebaseObj.audioUpdates = $scope.firebaseObj.audioUpdates+1;
            $scope.firebaseObj.$save();
        }).error(function(data){
            hideSpinner();
        });
        showSpinner();
    };

    $scope.playFile = function(file){
        if(file && file.buffer && file.file_name){
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
                url: '/p/'+projectId+'/audio',
                file: file
            }).success(function (data, status, headers, config) {
                if (data.success) {
                    data = loadSoundAndClips(data);
                    $scope.audioFiles.push(data);

                    audioState++;
                    $scope.firebaseObj.audioUpdates = $scope.firebaseObj.audioUpdates+1;
                    $scope.firebaseObj.$save();
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
            clips: [],
	        project: $routeParams['id']
        };
        $http.post('/track', track ).success(function(data){//data is returned from track_controller.rb#create


            track.key = data.key;
            track.name = 'track'+(track.key);
            $scope.tracks.push(track);

            trackState++;
            $scope.firebaseObj.trackUpdates =$scope.firebaseObj.trackUpdates+1;
            $scope.firebaseObj.$save();
        }).error(function(data, status, headers, config){
            console.log(status);
            alert("could not add track");
        });
    };
    $scope.removeTrack = function(deleteTrack) {
        var index;
        for (var i = 0; i < $scope.tracks.length; i++){
            if ($scope.tracks[i].key === deleteTrack.key) {
                index = i;
                break;
            }
        }
        $http.post('/deleteTrack', {track:deleteTrack}).success(function(data){//data is returned from track_controller.rb#create

            $scope.message = data;
            for (var i =0; i < $scope.tracks.length; i++)
                if ($scope.tracks[i].key === deleteTrack.key) {
                    $scope.tracks.splice(i,1);
                    break;
                }

            trackState++;
            $scope.firebaseObj.trackUpdates =$scope.firebaseObj.trackUpdates+1;
            $scope.firebaseObj.$save();
        }).error(function(data, status, headers, config){
            console.log(status);
            alert("could not delete track");
        });
    };

    $scope.refreshTracks = function(){

        $http.get('/p/'+projectId+'/track').success(function (data) {
            $scope.tracks = [];

            for (var i = 0; i < data.length; i++) {
                $scope.tracks.push(data[i]);
                for (var j = 0; j < data[i].clips.length; j++) {

                    var buffer = null;
                    for(var k=0; k<$scope.audioFiles.length;k++){
                        if($scope.audioFiles[k].key == data[i].clips[j].audio_key){
                            buffer = $scope.audioFiles[k].buffer;
                            console.log(buffer);
                        }
                    }
                    if(buffer) {
                        var clip = data[i].clips[j];
                        clip.length = buffer.duration;
                        clip.buffer = buffer;
                    }else{
                        console.log("clip not found");
                        //remove clip from tracks
                        data[i].clips.splice(j,1);
                    }
                }
            }
            $timeout(function(){
                for(var i =0; i<$scope.tracks.length;i++) {
                    var track = $scope.tracks[i];
                    for (var j = 0; j < track.clips.length; j++) {
                        var clip = track.clips[j];
                        attachSlider(clip);
                        element = document.getElementById(clip.clip_id);
                        console.log(clip.buffer);
                        drawWaveform(element.width, element.height, element.getContext("2d"), clip.buffer);
                        initClipPos(clip);
                        console.log("added clip to track: " + clip.clip_id);
                    }
                }
            });

        }).error(function () {
            alert("could not retrieve tracks");
        });
    };

    /////////////////////////////////////////////
    // Clip Functions
    /////////////////////////////////////////////
    function refreshClipsAfterZoom(){
        for(var i=0;i<$scope.tracks.length;i++) {
            var track = $scope.tracks[i];
            for(var j=0;j<track.clips.length;j++) {
                var clip = track.clips[j];
                var leftVal = parseFloat((clip.pos_in_track * $scope.zoomCoefficient)/100|| 0);
//console.log(clip);
                $("#"+clip.clip_id).css({left: leftVal});
            }
        }

        $timeout(function() {
            for (var i = 0; i < $scope.tracks.length; i++) {
                var track = $scope.tracks[i];
                for (var j = 0; j < track.clips.length; j++) {
                    var clip = track.clips[j];
                    element = document.getElementById(clip.clip_id);
                    if (element)
                        drawWaveform(element.width, element.height, element.getContext("2d"), clip.buffer);

                }
            }
        });
    }

    $scope.onSoundDrop = function(data, event, track){

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
                console.log("created clip");

                trackState++;
                $scope.firebaseObj.trackUpdates = $scope.firebaseObj.trackUpdates+1;
                $scope.firebaseObj.$save();

            }
            else{
                console.log("failure");
            }

        }).error(function(){
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
                    var x = (parseFloat((clip.pos_in_track * $scope.zoomCoefficient/100)|| 0) + event.dx );
                    x = x - (x%1);
                    if(x<0)
                        x=0;

                    var transform = "+=" + (event.dx - (event.dx%1));
                    $("#"+clip.clip_id).css({left: transform});

                    // translate the element
                    //target.style.transform = 'translate(' + x + 'px, ' + 0 + 'px)';

                    // update the position attributes
                    clip.pos_in_track = x*100.0/$scope.zoomCoefficient;
                },
                onend: function() {
                    $scope.$apply();
                    updateClipModel(clip);

                    trackState++;
                    $scope.firebaseObj.trackUpdates = $scope.firebaseObj.trackUpdates+1;
                    $scope.firebaseObj.$save();
                }
            });
        interact.maxInteractions(Infinity);   // Allow multiple interactions
    }

    function updateClipModel(clip){
        $http.post("/clips/"+clip.clip_id, {clip: clip}).success(function(data){
            if(data.success) {
                console.log("clip data updated");
            }
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
        var leftVal = parseFloat((clip.pos_in_track * $scope.zoomCoefficient/100)|| 0);
        console.log(leftVal);
        $("#"+clip.clip_id).css({left: leftVal});
        $scope.$apply();
    }

    /////////////////////////////////////////////
    // Firebase Functions
    /////////////////////////////////////////////

    init();
}]);
