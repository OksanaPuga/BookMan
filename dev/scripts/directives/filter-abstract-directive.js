angular.module('bookman')
	.directive('filterAbstract', function() {

		return {
			restrict: 'E',
			templateUrl: 'templates/directives/filter-abstr.html',
		}

	});