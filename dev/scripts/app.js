angular.module('bookman', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/pages/books/index.html',
            controller: 'BooksController',
            controllerAs: 'booksCtrl'
        })
        .when('/search', {
            templateUrl: 'templates/pages/search/index.html',
            controller: 'SearchController'
        })
        .when('/books/:id', {
            templateUrl: '/templates/pages/books/details.html',
            controller: 'BookDetailsController',
            controllerAs: 'bookDetCtrl'
        })
        //.when('/:alias', {
        //    templateUrl: '/singePage.html',
        //    controller: 'SingePageController'
        //});
}]);
