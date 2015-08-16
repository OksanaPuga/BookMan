angular.module('bookman')
    .directive('statisticsSection', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/statistics-section.html'
        };
    });
