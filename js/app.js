var myApp = angular.module('myApp', [
	'ngRoute',
	'tabControllers',
]);

myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/index', {
		templateUrl: 'partials/index.html',
		conroller: 'ListController'
	}).
	when('/catalog', {
		templateUrl: 'partials/catalog.html',
		controller: 'ListController'
	}).
	otherwise({
		redirectTo: '/index'
	});
}]);