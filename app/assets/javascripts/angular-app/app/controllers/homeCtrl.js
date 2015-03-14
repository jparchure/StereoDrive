/**
 * Created by saasbook on 09/02/15.
 */

app.controller("homeCtrl", ['$scope', '$http',function($scope, $http){
		
		$http.get('/users/1').success(function(data){

			$scope.currentuser=data;
		})
	
}]);
//$location for angular routes
