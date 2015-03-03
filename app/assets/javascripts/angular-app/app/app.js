/**
 * Created by saasbook on 09/02/15.
 */

var app = angular.module("app", ['ngRoute', 'templates','angularFileUpload','angularSpinner']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/home', {
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
