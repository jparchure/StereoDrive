/**
 * Created by saasbook on 09/02/15.
 */


var app = angular.module("app", ['ngRoute', 'ngCookies', 'xeditable', 'templates','angularFileUpload','angularSpinner']);

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
        .when('/artist',{
            title: 'artist',
            templateUrl: 'artist.html',
            controller: 'artistCtrl'
        })
        .otherwise({
            redirectTo: '/home'
        })
    }
]);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
