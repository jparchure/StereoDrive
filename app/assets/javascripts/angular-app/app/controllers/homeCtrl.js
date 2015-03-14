/**
 * Created by saasbook on 09/02/15.
 */

app.controller("homeCtrl", ['$scope', '$http', 'Auth',function($scope, $http, Auth){
		$scope.currentuser={};
    //console.log(globalAppCtx['user']);
		$http.get('/paytonleevieno').success(function(data){

			$scope.currentuser=data;
			
		});
		//console.log($scope.currentuser);
    //Authorization
    /*Auth.currentUser().then(function(user) {
            // User was logged in, or Devise returned
            // previously authenticated session.
            console.log(user); // => {id: 1, ect: '...'}
        }, function(error) {
            // unauthenticated error
        });*/

		 $scope.saveUser = function() {
    // $scope.user already updated!
    	return true;/*$http.post('/saveUser', $scope.user).error(function(err) {
      	if(err.field && err.msg) {
        // err like {field: "name", msg: "Server-side error for this username!"} 
        $scope.editableForm.$setError(err.field, err.msg);
      } else { 
        // unknown error
        $scope.editableForm.$setError('name', 'Unknown error!');
      };
    });*/
  };
	
}]);
//$location for angular routes