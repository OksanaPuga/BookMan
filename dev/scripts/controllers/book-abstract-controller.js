angular.module('bookman')
    .controller('BookAbstractController', ['$scope', '$routeParams', 'Book', 'Books', function ($scope, $routeParams, Book, Books) {

        $scope.book = Books.getBookByID($routeParams.id);
        $scope.currentTab = 'abstr';

        $scope.isCurrent = function (tab) {
            return $scope.currentTab === tab;
        }

        $scope.abstrItemToAdd = {
            type: 'quote',
            content: ''
        };

        $scope.addAbstrItem = function () {
            if ($scope.abstrItemToAdd.content) {
                if ($scope.abstrItemToAdd.type === 'review') {
                    $scope.book.review = $scope.abstrItemToAdd.content;
                } else {
                    $scope.book.abstractItems.push($scope.abstrItemToAdd);
                }
                $scope.abstrItemToAdd = {
                    type: 'quote',
                    content: ''
                };
            }

            var currentbook = new Book($scope.book);
            currentbook.update();
        }
}]);
