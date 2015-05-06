app.controller("createArtistCtrl", ['$scope', '$routeParams', '$http', '$cookies', function($scope,$routeParams, $http, $cookies){


		$scope.userData = {};
		$scope.processForm= function(form){
			 if(form.$pristine || form.$invalid ){
			 	alert("You can not submit incomplete form");
			 	return false;
			 }
			 if(confirm("Are you sure you want to create a new band?")){

            
            route='/artists';

            console.log("GENRE SENT: ", $scope.userData.genre);
            $http.post(route, $scope.userData).error(function(err) {
                if(err.field && err.msg) {
            // err like {field: "name", msg: "Server-side error for this username!"} 
                $scope.editableForm.$setError(err.field, err.msg);
                } else { 
            // unknown error
             $scope.editableForm.$setError('name', 'Unknown error!');
                }
             });
            $scope.$parent.getArtistData();
        }
        $scope.cancel(form);
        //console.log("THE EXISTING SCOPE IS: " + $scope.userData);
        //$scope.$parent.getArtistData();
		};

	$scope.reset=function(form){

		
		if (form) {
      form.$setPristine();
      form.$setUntouched();
    	}
		$scope.userData={};
	};
	$scope.cancel=function(form){
		$scope.reset(form);
		$scope.$parent.toggleModal();
	};

}])