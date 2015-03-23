/**
 * Created by saasbook on 09/02/15.
 */

app.controller("homeCtrl", ['$scope', '$routeParams', '$http', '$cookies', function($scope,$routeParams, $http, $cookies){

        current_user_id= $cookies['id'];
        
        $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

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

		$http.get(route).success(function(data){
			$scope.currentuser=data;
		});
        $http.get(artRoute).success(function(data){
            $scope.artistList=data;

        });
        
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

        $scope.classyWiggle=function(){
                $scope.artistEdit=!($scope.artistEdit);
            
                if($('.wiggle').ClassyWiggle('isWiggling')){
                  
                 $('.wiggle').ClassyWiggle('stop');
                }
                else{
                    $('.wiggle').ClassyWiggle('start', {'degrees': [0,7.5,15,7.5,0,-7.5,-15,-7.5,0]});
                    
                }
        };


		
	
}]);
//$location for angular routes
