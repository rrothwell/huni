'use strict';

/* App Module */

var personSearch = angular.module('huniaggregate', [
	'sparqlServices',
	'pagination']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
	  when('/familyname-search', {templateUrl: 'partials/huniaggregate/people/familyname.html', controller: PersonSearchCtrl}).
	  when('/placename-search', {templateUrl: 'partials/huniaggregate/places/placename.html', controller: PlaceSearchCtrl}).
	  when('/objectname-search', {templateUrl: 'partials/huniaggregate/objects/objectname.html', controller: ObjectSearchCtrl}).
	  when('/eventname-search', {templateUrl: 'partials/huniaggregate/events/eventname.html', controller: EventSearchCtrl}).
      otherwise({redirectTo: '/familyname-search'});
}]);