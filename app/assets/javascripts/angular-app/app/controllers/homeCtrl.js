/**
 * Created by saasbook on 09/02/15.
 */

app.controller("homeCtrl", ['$scope', '$routeParams', '$http', '$cookies', function($scope,$routeParams, $http, $cookies){

        current_user_id= $cookies['id'];
       

        if($routeParams['op']){ //If accessing others' profile, check for route params
            route='/users/'+ $routeParams['op'];
            artRoute='/artist/list/' + $routeParams['op'];
            console.log($routeParams['op']);
            $scope.showEditButton=false;
        }  
        else{
        route='/users/' + current_user_id + "/";
        artRoute='/artist/list/' + current_user_id + "/";
        $scope.showEditButton = true;
        }

		$http.get(route).success(function(data){
			$scope.currentuser=data;
		});
        $http.get(artRoute).success(function(data){
            $scope.artistList=data;

        });
        
        $scope.saveUser= function(){
            route='/users/' + current_user_id;
            console.log(route);
            $http.put(route, $scope.currentuser).error(function(err) {
                if(err.field && err.msg) {
        // err like {field: "name", msg: "Server-side error for this username!"} 
                $scope.editableForm.$setError(err.field, err.msg);
                } else { 
        // unknown error
             $scope.editableForm.$setError('name', 'Unknown error!');
                }
        });
        };
        //Wiggling to delete bands
        $scope.classyWiggle=function(){
                $scope.artistEdit=!($scope.artistEdit);
            
                if($('.wiggle').ClassyWiggle('isWiggling')){
                  
                 $('.wiggle').ClassyWiggle('stop');
                }
                else{

                    $('.wiggle').ClassyWiggle('start', {'degrees': [0,7.5,15,7.5,0,-7.5,-15,-7.5,0]});
                    
                }
        };


        $scope.artistAction= function(event){
        	href="/artist/" + event.currentTarget.id;
        	if($('.wiggle').ClassyWiggle('isWiggling')){

        		
        		deleteBand(event);
        	}
        	else{
        		$location.url("#" + href);
        	}
        };
        //Deleting a band
        var deleteBand = function(event){
        		console.log("Event: " + event.currenTarget.id + "CUI: " + current_user_id)
        		if(event.currentTarget.id === current_user_id ){
        			alert("You can not delete the solo band");
        		}
        		else if(confirm('Are you sure you want to delete this?')){
        		$http.delete(href).error(function(err){
        			if(err.field && err.msg) {
        		// err like {field: "name", msg: "Server-side error for this username!"} 
                $scope.editableForm.$setError(err.field, err.msg);
                } else { 
        		// unknown error
             $scope.editableForm.$setError('name', 'Unknown error!');
                }
        		});
        	}
        };



         $scope.showModal = false;
        $scope.toggleModal = function(){
        $scope.showModal = !$scope.showModal;
    };
        //Modal for creating a band
        /*$scope.showModal = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };*/
		
	
}]);
//$location for angular routes



app.directive('modal', function () {
    return {
      template: '<div class="modal fade" id = "myModal">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $('#myModal').modal('show');
          else
            $('#myModal').modal('hide');
        });

        $('#myModal').on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });