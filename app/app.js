/**
 * Created by saasbook on 09/02/15.
 */

var app = angular.module("app", ['ngRoute']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/home', {
            title: 'home',
            templateUrl: 'app/views/home.html'
        })
        .otherwise({
            redirectTo: '/home'
        })
    }
]);
