/**
 * Created by saasbook on 09/02/15.
 */


var app = angular.module("app", ['ngRoute', 'xeditable', 'templates','angularFileUpload','angularSpinner']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/home/:op?', {
            title: 'home',
            templateUrl: 'home.html',
            controller: 'homeCtrl'
        })
        .when('/daw', {
            title: 'daw',
            templateUrl: 'daw.html',
            controller: 'dawCtrl'
        })
        .when('/band',{
            title: 'band',
            templateUrl: 'band.html',
            controller: 'bandCtrl'
        })
        .otherwise({
            redirectTo: '/home'
        })
    }
]);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
