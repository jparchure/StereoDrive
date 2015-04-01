/**
 * Created by saasbook on 09/02/15.
 */

	
app.controller("artistCtrl", ['$scope', '$routeParams','$cookies','$http',function($scope,  $cookies,$routeParams, $http){
		//$scope.artist = {name:"Queen",tagline:"Mama! Just killed a Man!", genre:"Rock", origin:"1970",email:"queen@queen.com",location:"London, UK",image:"http://hittesti.com/wp-content/uploads/2014/10/queen-testi-canzoni.jpg", songs:["Bohemian Rhapsody", "We Will Rock You", "We are the Champions", "Don't stop me now"], members:[{name:"Brian May", image:"http://upload.wikimedia.org/wikipedia/commons/5/57/Brian_May_Portrait_-_David_J_Cable.jpg"},{name:"Roger Taylor", image:"http://hangout.altsounds.com/attachments/reviews/3119d1264890134-roger-taylor-unblinking-eye-broken-single-rogertaylor.jpg"},{name:"Freddie Mercury", image:"http://cp91279.biography.com/1000509261001/1000509261001_1814783179001_Simone-and-Schuster-The-Life-of-Queen-Lead-Singer-Freddie-Mercuty.jpg"}]};			
		$scope.currentuser_id= $cookies['id'];

		$http.get('/artists/' + $routeParams['id']).success(function(data){
			$scope.artist=data;

		});

		$http.get('/artist/member/' + $routeParams['id']).success(function(data){
			$scope.memberlist=data;
		
		});

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

