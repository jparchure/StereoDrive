app.controller("searchUserToAddCtrl", ['$scope', '$routeParams', '$http', '$cookies', function($scope,$routeParams, $http, $cookies){

		//$('#textdiv').animate({scrollTop: $('#textdiv').prop("scrollHeight")}, 500);
		$scope.userToBeAdded = {artist_id: $routeParams['id']};
		$scope.lookUpUser= function(form){
			 if(form.$pristine || form.$invalid ){
			 	alert("You can not submit incomplete form");
			 	return false;
			 }
            
            route='/artists/add';


            $http.post(route, $scope.userToBeAdded).error(function(err) {
               console.log(err);
             });
            $scope.cancel(form);

            $scope.$parent.getMemberdata();
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