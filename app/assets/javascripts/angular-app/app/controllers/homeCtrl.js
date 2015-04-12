/**
 * Created by saasbook on 09/02/15.
 */

app.controller("homeCtrl", ['$scope', '$routeParams', '$http', '$cookies', '$location', function($scope,$routeParams, $http, $cookies, $location){

        current_user_id= $cookies['id'];
       

        if($routeParams['op']){ //If accessing others' profile, check for route params
            route='/users/'+ $routeParams['op'];
            artRoute='/artist/list/' + $routeParams['op'];
            console.log($routeParams['op']);
            $scope.showEditButton=false;
        }  
        else{
        route='/users/' + current_user_id + "/";
        artRoute='/artist/list/' + current_user_id + "/";
        $scope.showEditButton = true;
        }
        
       $scope.getUserData=function(){
		$http.get(route).success(function(data){
			$scope.currentuser=data;
		});
        };

        $scope.getArtistData = function(){
        $http.get(artRoute).success(function(data){
            $scope.artistList=data;

        }); 
        };

        $scope.getUserData();
        $scope.getArtistData();

        $scope.saveUser= function(){
            route='/users/' + current_user_id;
            console.log(route);
            $http.put(route, $scope.currentuser).error(function(err) {
                if(err.field && err.msg) {
        // err like {field: "name", msg: "Server-side error for this username!"} 
                $scope.editableForm.$setError(err.field, err.msg);
                } else { 
        // unknown error
             $scope.editableForm.$setError('name', 'Unknown error!');
                }
        });
        };

        //Wiggling to delete bands
        $scope.classyWiggle=function(){
                $scope.artistEdit=!($scope.artistEdit);
            
                if($('.wiggle').ClassyWiggle('isWiggling')){
                  
                 $('.wiggle').ClassyWiggle('stop');
                }
                else{

                    $('.wiggle').ClassyWiggle('start', {'degrees': [0,7.5,15,7.5,0,-7.5,-15,-7.5,0]});
                    
                }
        };


        $scope.artistAction= function(event){
        	href="/artist/" + event.currentTarget.id;
        	if($('.wiggle').ClassyWiggle('isWiggling')){

        		
        		deleteBand(event);
        	}
        	else{
        		$location.url(href);
        	}
        };
        //Deleting a band
        var deleteBand = function(event){
        		console.log("Event: " + event.currentTarget.id + "CUI: " + current_user_id)
        		if(event.currentTarget.id === current_user_id ){
        			alert("You can not delete the solo band");
        		}
        		else if(confirm('Are you sure you want to delete this?')){
        		$http.delete(href).error(function(err){
        			if(err.field && err.msg) {
        		// err like {field: "name", msg: "Server-side error for this username!"} 
                $scope.editableForm.$setError(err.field, err.msg);
                } else { 
        		// unknown error
             $scope.editableForm.$setError('name', 'Unknown error!');
                }
        		});
        	}
        };


//Create Band


         $scope.showModal = false;
        
        $scope.toggleModal = function(){
        $scope.showModal = !$scope.showModal;
        };

		
	
}]);
