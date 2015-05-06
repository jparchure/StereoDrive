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

		$scope.searchArtist = function(){
			$http.get('/search/' + $routeParams['substring']).success(function(data){
				var allartists = data;
				traversedartists = [];
				console.log(allartists);
				for(var i = 0; i<allartists.length; i++){
					if (allartists[i].name.toLowerCase().indexOf($routeParams['substring'].toLowerCase()) >= 0) {
						traversedartists.push(allartists[i]);
					};
				}
				$scope.searchedartists = traversedartists;
			});
		};

		$scope.getMemberdata = function(){
		$http.get('/artist/member/' + $routeParams['id']).success(function(data){
			$scope.memberlist=data;
		});
		};
		
		$scope.getArtistdata();
		$scope.getMemberdata();
		$scope.searchArtist();

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

        $scope.addUsers = false;
        
        $scope.toggleAddUsers = function(){
        $scope.addUsers= !$scope.addUsers;
        };
	
}]);
//$location for angular routes

