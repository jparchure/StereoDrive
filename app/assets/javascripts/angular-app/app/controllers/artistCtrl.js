/**
 * Created by saasbook on 09/02/15.
 */

	
app.controller("artistCtrl", ['$scope', '$routeParams','$cookies','$http',function($scope, $routeParams,$cookies, $http){
		
		$scope.currentuser_id= $cookies['id'];

		console.log("THE DATA IS:" + $routeParams['id'] );

		$scope.getArtistdata = function(){
		$http.get('/artists/' + $routeParams['id']).success(function(data){
			$scope.artist=data;
		});
		};

		$scope.getMemberdata = function(){
		$http.get('/artist/member/' + $routeParams['id']).success(function(data){
			$scope.memberlist=data;
		});
		};
		
		$scope.getArtistdata();
		$scope.getMemberdata();

		$scope.saveUser= function(){
            route='/artists/' + $routeParams['id'];
            $http.put(route, $scope.artist).error(function(err) {
                if(err.field && err.msg) {
        // err like {field: "name", msg: "Server-side error for this username!"} 
                $scope.editableForm.$setError(err.field, err.msg);
                } else { 
        // unknown error
             $scope.editableForm.$setError('name', 'Unknown error!');
                }
        });
        }; //Save user ends here
	
}]);
//$location for angular routes

