angular.module('bookman', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/books.html',
                controller: 'BooksController'
            })
            .when('/book/:id', {
                templateUrl: '/bookDetails.html',
                controller: 'BooksDetailController'
            })
            .when('/:alias', {
                templateUrl: '/singePage.html',
                controller: 'SingePageController'
            });
  }]);
