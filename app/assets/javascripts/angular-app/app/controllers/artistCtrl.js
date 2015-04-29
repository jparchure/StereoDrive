/**
 * Created by saasbook on 09/02/15.
 */

	
app.controller("artistCtrl", ['$scope', '$routeParams','$cookies','$http', '$timeout', '$location', function($scope, $routeParams,$cookies, $http, $timeout, $location){
		
		currentuser_id= $cookies['id'];
		//var memberList =[];
		$scope.showEditButton=false;
		//$scope.memberlist=[];
		$scope.getArtistdata = function(){
		$http.get('/artists/' + $routeParams['id']).success(function(data){
			$scope.artist=data;
			//console.log($scope.artist.genre);
		});
		};
	    $scope.createProject = function(){
		$http.post('/project' ).success(function(data){//data is returned from track_controller.rb#create

		    console.log(data);
		}).error(function(data, status, headers, config){
		    console.log(status);
		    alert("could not create project");
		});
		getProjects();
	    };

		$scope.searchArtist = function(){
			$http.get('/search/' + $routeParams['substring']).success(function(data){
				var allartists = data;
				$scope.traversedartists = [];
				console.log(allartists);
				for(var i = 0; i<allartists.length; i++){
					if (allartists[i].name.toLowerCase().indexOf($routeParams['substring'].toLowerCase()) >= 0) {
						$scope.traversedartists.push(allartists[i]);
					};
				}
				$scope.searchedartists = $scope.traversedartists;
			});
		};
		var getProjects = function () {
			$scope.projects = [];
		$http.get('/project/list/' + $routeParams['id']).success(function (data) {

		    for (var i = 0; i < data.projects.length; i++) {
			$scope.projects.push(data.projects[i])
		    }
		    console.log($scope.projects)

		}).error(function (data, status, headers, config) {

		    alert("error. could not fetch projects");
		})
	    };

	    
	    if($routeParams['id'] != null){
	    	getProjects();
	    }
	    
	  
		$scope.getMemberdata = function(){
		$http.get('/artist/member/' + $routeParams['id']).success(function(data){
			console.log("Befor: ", $scope.showEditButton);
			$scope.memberlist=data;
			showEditButton();
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

        //Code to enable adding users to bands
        $scope.addUsers = false;
        
        $scope.toggleAddUsers = function(){
        
        if($scope.artist.is_solo){
				alert("You can't add members to solo band");
				return false;
			}
		$scope.addUsers= !$scope.addUsers;
        };


        //code to delete members from bands
        $scope.toggleDelete=function(){
        	$scope.memberEdit = !$scope.memberEdit;
        }


        $scope.memberAction= function(event){
        	href="/artists/remove";
        	if($scope.memberEdit){

        		deleteArtist(event);
        	}
        	else{
        		$location.url("/home/" + event.currentTarget.id);
        	}

        };
        //Deleting a band
        
        var deleteArtist = function(event){
                
                if($scope.memberlist.length===1){
                	//If last user then delete the band
                	if(confirm("Are you sure you want to delete " + $scope.artist.name)){
                	$http.delete("/artists/" + $routeParams['id']).error(function(err){
        				console.log(err);
        				});
                	$location.url("/home");
                	}
                }

        		else if(confirm('Are you sure you want to banish this user from ' + $scope.artist.name)){
        		var deleteData={user_id: event.currentTarget.id, artist_id: $routeParams['id']}
        		$http.post(href, deleteData).error(function(err){
        			console.log(err);
                	
        		});
        		if(event.currentTarget.id == currentuser_id){
        			//If deleted self from band
        			$location.url("/home");
        		}
                $scope.getMemberdata();
                $scope.showEditButton=false;
        	}

        };

		
		var showEditButton=function(){
			for(i=0;i<$scope.memberlist.length;i++){
				if($scope.memberlist[i].id == currentuser_id){
					$scope.showEditButton=true;
				}
			}

		};
		

		//enableEdit();
}]);
//$location for angular routes

