/**
 * Created by saasbook on 09/02/15.
 */

app.controller("homeCtrl", ['$scope', '$http',function($scope, $http){

		$http.get('/users/1').success(function(data){

			$scope.currentuser=data;
			
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
