/**
 * Created by saasbook on 09/02/15.
 */


var app = angular.module("app", ['ngRoute', 'ui.bootstrap', 'ngCookies', 'xeditable', 'templates','angularFileUpload','angularSpinner', 'ngDraggable','firebase','ngAutoComplete']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/home/:op?', {
            title: 'home',
            templateUrl: 'home.html',
            controller: 'homeCtrl'
        })
        .when('/daw/:id?', {
            title: 'daw',
            templateUrl: 'daw.html',
            controller: 'dawCtrl'
        })
        .when('/artist/:id?',{
            title: 'artist',
            templateUrl: 'artist.html',
            controller: 'artistCtrl'
        })

        .when('/search/:substring?',{
            title: 'search',
            templateUrl: 'search.html',
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
