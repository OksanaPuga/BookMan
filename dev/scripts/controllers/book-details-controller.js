angular.module('bookman')
    .controller('BookDetailsController', ['$scope', '$routeParams', 'Book', 'Books', function ($scope, $routeParams, Book, Books) {

        $scope.book = Books.getBookByID($routeParams.id);
        $scope.currentTab = 'info';

        $scope.changeTab = function (tab) {
            $scope.currentTab = tab;
        }

        $scope.isCurrent = function (tab) {
            return $scope.currentTab === tab;
        }

        $scope.abstrItemToAdd = {
            type: 'quote',
            content: ''
        };

        $scope.addAbstrItem = function () {
            if ($scope.abstrItemToAdd.type === 'review') {
                $scope.book.review = $scope.abstrItemToAdd.content;
            } else {
                $scope.book.abstractItems.push($scope.abstrItemToAdd);
            }
            $scope.abstrItemToAdd = {
                type: 'quote',
                content: ''
            };

            var currentbook = new Book ($scope.book);
            currentbook.update();
        }
}]);
