app.controller("searchUserToAddCtrl", ['$scope', '$routeParams', '$http', '$cookies', function($scope,$routeParams, $http, $cookies){


		$scope.userToBeAdded = {artist_id: $routeParams['id']};
		$scope.lookUpUser= function(form){
			 if(form.$pristine || form.$invalid ){
			 	alert("You can not submit incomplete form");
			 	return false;
			 }
			 console.log($scope.userToBeAdded);

            
            route='/artists/add';


            $http.post(route, $scope.userToBeAdded).error(function(err) {
               console.log(err);
             });
            $scope.cancel(form);
            //$scope.$parent.getArtistData();
        }
        
        //console.log("THE EXISTING SCOPE IS: " + $scope.userData);
        //$scope.$parent.getArtistData();
		

	$scope.reset=function(form){

		
		if (form) {
      form.$setPristine();
      form.$setUntouched();
    	}
		$scope.userToBeAdded={};
	};
	$scope.cancel=function(form){
		$scope.reset(form);
		$scope.$parent.toggleAddUsers();
	};

}])