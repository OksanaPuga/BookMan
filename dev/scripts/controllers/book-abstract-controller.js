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
                    if ($scope.abstrItemToAdd.type === 'quote') {
                        $scope.book.quotesAmount++;
                    } else {
                        $scope.book.notesAmount++;
                    }
                }
                $scope.abstrItemToAdd = {
                    type: 'quote',
                    content: ''
                };

                $scope.book.modified = new Date();
                var currentbook = new Book($scope.book);
                currentbook.update();
            }
        }
}]);
