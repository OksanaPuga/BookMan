angular.module('bookman')
    .directive('editDeleteBtn', function () {

        return {
            restrict: 'E',
            templateUrl: 'templates/directives/edit-delete-btn.html',
            controller: function ($scope, $routeParams, Books, Book) {
                $scope.deleteBook = function() { 
                    var book = Books.getBookByID($routeParams.id); 
                     book = new Book(book);
                     book.delete();    
                }
                return {
                    editPageUrl: '#/books/' + $routeParams.id + '/edit',
                    deletePageUrl: '#/books'
                };
            },
            controllerAs: 'editDelCtrl'
        }

    });
