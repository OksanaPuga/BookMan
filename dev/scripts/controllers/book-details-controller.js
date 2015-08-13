angular.module('bookman')
    .controller('BookDetailsController', ['$scope', '$routeParams', 'Books', function ($scope, $routeParams, Books) {

        $scope.book = Books.getBookByID($routeParams.id);
        $scope.currentTab = 'info';
}]);
