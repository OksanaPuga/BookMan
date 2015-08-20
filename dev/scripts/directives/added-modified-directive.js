angular.module('bookman')
	.directive('addedModified', function() {

		return {
			restrict: 'E',
			templateUrl: 'templates/directives/added-modified-section.html',
		}

	});