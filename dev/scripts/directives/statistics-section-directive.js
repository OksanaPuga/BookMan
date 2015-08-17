angular.module('bookman')
    .directive('statisticsSection', ['Books', function (Books) {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/statistics-section.html',
            controller: function () {
                this.books = Books.getAllBooks();
            },
            controllerAs: 'statSecCtrl'
        };
    }]);
