/**
 * Created by saasbook on 09/02/15.
 */

	
app.controller("artistCtrl", ['$scope', '$routeParams','$cookies','$http', '$timeout', '$location', function($scope, $routeParams,$cookies, $http, $timeout, $location){
		
		$scope.currentuser_id= $cookies['id'];
		//var memberList =[];
		$scope.showEditButton=false;
		//$scope.memberlist=[];
		$scope.getArtistdata = function(){
		$http.get('/artists/' + $routeParams['id']).success(function(data){
			$scope.artist=data;
			
		});
		};

		$scope.getMemberdata = function(){
		$http.get('/artist/member/' + $routeParams['id']).success(function(data){
			console.log("Befor: ", $scope.showEditButton);
			$scope.memberlist=data;
			showEditButton();
			//memberList = data;
			console.log("After: ", $scope.showEditButton);
		});
		};
		
		$scope.getArtistdata();
		$scope.getMemberdata();
		//console.log(memberlist);
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

        //Code to enable adding users to bands
        $scope.addUsers = false;
        
        $scope.toggleAddUsers = function(){
        $scope.addUsers= !$scope.addUsers;
        };


        //code to delete members from bands
        $scope.toggleDelete=function(){
        	$scope.memberEdit = !$scope.memberEdit;
        }


        $scope.memberAction= function(event){
        	href="/home/" + event.currentTarget.id;
        	if($scope.memberEdit){

        		deleteArtist(event);
        	}
        	else{
        		$location.url(href);
        	}
        };
        //Deleting a band
        var deleteArtist = function(event){
                if(event.currentTarget.id === $scope.currentuser_id ){
        			alert("You can not delete yourself from the solo band");
        		}
        		else if(confirm('Are you sure you want to delete this?')){
        		$http.delete(href).error(function(err){
        			console.log(err);
                
        		});
                $scope.getMemberdata();
        	}

        };

		
		var showEditButton=function(){
			for(i=0;i<$scope.memberlist.length;i++){
				if($scope.memberlist[i].id == $scope.currentuser_id){
					$scope.showEditButton=true;
				}
			}
		};
		
		//enableEdit();
}]);
//$location for angular routes

