angular.module('bookman')
    .controller('BookEditController', ['$scope', '$routeParams', 'Book', 'Books', function ($scope, $routeParams, Book, Books) {

        $scope.book = Books.getBookByID($routeParams.id);

        $scope.editedBookInfo = {};
        for (var param in $scope.book) {
            $scope.editedBookInfo[param] = $scope.book[param];
        }

        $scope.backUrl = '#/books/' + $routeParams.id;
        $scope.saveChanges = function () {

            for (var param in $scope.editedBookInfo) {
                $scope.book[param] = $scope.editedBookInfo[param];
            }


            new Book($scope.book).update();
        }

    }]);
