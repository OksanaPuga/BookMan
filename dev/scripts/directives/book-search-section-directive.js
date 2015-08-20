angular.module('bookman')
	.directive('bookSearchSection', function() {

		return {
			restrict: 'E',
			templateUrl: 'templates/directives/book-search-section.html',
		}

	});