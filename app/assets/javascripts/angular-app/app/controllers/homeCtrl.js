/**
 * Created by saasbook on 09/02/15.
 */

app.controller("homeCtrl", ['$scope', '$routeParams', '$http', '$cookies', function($scope,$routeParams, $http, $cookies){

        current_user_id= $cookies['id'];
        //console.log($routeParams);
        if($routeParams['op']){ //If accessing others' profile, check for route params
            route='/users/'+ $routeParams['op'];
            artRoute='/artist/list/' + $routeParams['op'];
            console.log($routeParams['op']);
        }  
        else{
        route='/users/' + current_user_id + "/";
        artRoute='/artist/list/' + current_user_id + "/";
        console.log("If params in:" + current_user_id)
        }

		$http.get(route).success(function(data){
			$scope.currentuser=data;
		});
        $http.get(artRoute).success(function(data){
            $scope.artistList=data;

        });
        //If param set route= show + cookie
        //route = show
		//console.log($scope.currentuser);
    //Authorization
    /*Auth.currentUser().then(function(user) {
            // User was logged in, or Devise returned
            // previously authenticated session.
            console.log(user); // => {id: 1, ect: '...'}
        }, function(error) {
            // unauthenticated error
        });*/

		
	
}]);
//$location for angular routes
