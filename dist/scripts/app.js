angular.module('bookman', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/books'
        })
        .when('/books', {
            templateUrl: 'templates/pages/books/index.html',
            controller: 'BooksController',
            controllerAs: 'booksCtrl'
        })
        .when('/search', {
            templateUrl: 'templates/pages/search/index.html',
            controller: 'SearchController'
        })
        .when('/books/:id/info', {
            templateUrl: 'templates/pages/books/details/info.html',
            controller: 'BookInfoController',
            controllerAs: 'bookInfoCtrl'
        })
        .when('/books/:id/abstract', {
            templateUrl: 'templates/pages/books/details/abstract.html',
            controller: 'BookAbstractController',
            controllerAs: 'bookAbstrCtrl'
        })
        .when('/books/:id/content', {
            templateUrl: 'templates/pages/books/details/content.html',
            controller: 'BookContentController',
            controllerAs: 'bookContCtrl'
        })
        .when('/books/:id/edit', {
            templateUrl: 'templates/pages/books/edit.html',
            controller: 'BookEditController',
            controllerAs: 'bookEditCtrl'
        })
        .otherwise({
            redirectTo: '/books'
        })
}]);

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

angular.module('bookman')
    .controller('BookContentController', ['$scope', '$routeParams', 'Book', 'Books', function ($scope, $routeParams, Book, Books) {

        $scope.book = Books.getBookByID($routeParams.id);
        $scope.currentTab = 'cont';

        $scope.isCurrent = function (tab) {
            return $scope.currentTab === tab;
        }
}]);

angular.module('bookman')
    .controller('BookEditController', ['$scope', '$routeParams', 'Book', 'Books', function ($scope, $routeParams, Book, Books) {

        $scope.book = Books.getBookByID($routeParams.id);

        $scope.editedBookInfo = {};
        for (var param in $scope.book) {
            $scope.editedBookInfo[param] = $scope.book[param];
        }

        $scope.backUrl = '#/books/' + $routeParams.id + '/info';
        $scope.saveChanges = function () {

            for (var param in $scope.editedBookInfo) {
                $scope.book[param] = $scope.editedBookInfo[param];
            }


            new Book($scope.book).update();
        }

    }]);

angular.module('bookman')
    .controller('BookInfoController', ['$scope', '$routeParams', 'Book', 'Books', function ($scope, $routeParams, Book, Books) {

        $scope.book = Books.getBookByID($routeParams.id);
        $scope.currentTab = 'info';

        $scope.isCurrent = function (tab) {
            return $scope.currentTab === tab;
        }

}]);

angular.module('bookman')
    .controller('BooksController', ['$scope', 'Books', 'Book', function ($scope, Books, Book) {

        $scope.books = Books.getAllBooks();

    }]);

angular.module('bookman').controller('SearchController', ['$scope', 'Books', 'Book', function ($scope, Books, Book) {
    
    $scope.books = Books.getAllBooks();

}]);
angular.module('bookman')
    .directive('detailsFlags', function () {

        return {
            restrict: 'A',
            templateUrl: 'templates/directives/details-flags.html',
            controller: function ($routeParams) {
                return {
                    infoUrl: '#/books/' + $routeParams.id + '/info',
                    contentUrl: '#/books/' + $routeParams.id + '/content',
                    abstractUrl: '#/books/' + $routeParams.id + '/abstract'
                };
            },
            controllerAs: 'flagsCtrl'
        }

    });

angular.module('bookman')
    .directive('editDeleteBtn', function () {

        return {
            restrict: 'E',
            templateUrl: 'templates/directives/edit-delete-btn.html',
            controller: function ($routeParams) {
                return {
                    editPageUrl: '#/books/' + $routeParams.id + '/edit'
                };
            },
            controllerAs: 'editDelCtrl'
        }

    });

angular.module('bookman')
    .directive('mainNav', function(){
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/main-nav.html',
            scope: true,
            link: function($scope, element, attrs) {
                $scope.class = "";
                element.find("a.btn-menu").on('click', function() {
                    if ($scope.class == ""){
                        $scope.class = "active"
                    } else {
                        $scope.class = "";
                    }
                    
                });         
            },
            controller: function($scope, $location) {
               $scope.isActive = function (viewLocation) {
                     return viewLocation === $location.path();
                };    
            }
        }
    });
angular.module('bookman')
    .directive('saveCancelBtn', function () {

        return {
            restrict: 'E',
            templateUrl: 'templates/directives/save-cancel-btn.html',
            controller: function ($routeParams) {
                return {
                    backUrl: '#/books/' + $routeParams.id + '/info'
                };
            },
            controllerAs: 'saveCancelCtrl'
        }

    });

$(document).ready(function () {
    var $asidelink = $('.aside-link'), $wrapsidebar = $('.content'), $btnmenu = $('.btn-menu');
    $asidelink.click(function () {
        $asidelink.toggleClass('active');
        $wrapsidebar.toggleClass('active');
        return false;
    });
    

});
    
angular.module('bookman').factory('Book', function BookFactory() {

    var BookFactory = function (obj) {

        this.id = obj.id;
        this.title = obj.title || null;

        if (obj.author) {
            if (angular.isArray(obj.author)) {
                this.author = obj.author.join(', ');
            } else {
                this.author = obj.author;
            }
        } else {
            this.author = obj.author;
        }

        this.image = obj.image || null;

        if (obj.category) {
            if (angular.isArray(obj.category)) {
                this.category = obj.category.join(', ');
            } else {
                this.category = obj.category;
            }
        } else {
            this.category = null;
        }

        this.publisher = obj.publisher || null;
        this.publicationDate = obj.publicationDate || null;
        this.length = obj.length || null;
        this.description = obj.description || null;
        this.review = obj.review || null;
        this.abstractItems = obj.abstractItems || [];
    };

    var currentBooks = [];

    BookFactory.prototype.save = function () {
        if (localStorage.getItem('books')) {
            currentBooks = angular.fromJson(localStorage.getItem('books'));
        }
        currentBooks.push(this);
        localStorage.setItem('books', angular.toJson(currentBooks));
    };

    BookFactory.prototype.update = function () {
        var that = this,
            isNew = true;
        if (!localStorage.getItem('books')) {
            that.save();
        } else {
            currentBooks = angular.fromJson(localStorage.getItem('books'));
            angular.forEach(currentBooks, function (obj, index) {
                if (obj.id == that.id) {
                    angular.forEach(that, function (value, property) {
                        obj[property] = value;
                    });
                    localStorage.setItem('books', angular.toJson(currentBooks));
                    isNew = false;
                }
            });
            if (isNew) {
                that.save();
            }
        }
    };

    BookFactory.prototype.delete = function () {
        console.log('delete');
    };

    return BookFactory;
});

angular.module('bookman').factory('Books', function BooksFactory($http, Book) {
    var factory = {};

    factory.init = function () {
        var rawBooksArray = $http.get("https://www.googleapis.com/books/v1/users/114873229240336350134/bookshelves/0/volumes");
        rawBooksArray.success(function (response) {
            var book, elm, obj, appBooks = response.items;
            for (var property in appBooks) {
                elm = appBooks[property];
                obj = {
                    id: elm.id,
                    title: elm.volumeInfo.title,
                    author: elm.volumeInfo.authors,
                    publisher: elm.volumeInfo.publisher,
                    publicationDate: elm.volumeInfo.publishedDate,
                    image: elm.volumeInfo.imageLinks.thumbnail,
                    category: elm.volumeInfo.categories,
                    length: elm.volumeInfo.pageCount,
                    description: elm.volumeInfo.description
                }
                book = new Book(obj);
                book.update();
            }
        });
    };


    (function () {
       if (!localStorage.getItem('books')) {
			factory.init();
        }
    })();


    factory.getAllBooks = function () {
        return angular.fromJson(localStorage.getItem('books'));
    };
    factory.getBookByID = function (id) {
        var books = angular.fromJson(localStorage.getItem('books'));
        for (var i = 0; i < books.length; i++) {
            if (books[i].id === id) {
                return books[i];
            }
        }
    };

    return factory;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWJzdHJhY3QtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stY29udGVudC1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYm9vay1lZGl0LWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rLWluZm8tY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2tzLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9zZWFyY2gtY29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvZGV0YWlscy1mbGFncy1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL2VkaXQtZGVsZXRlLWJ0bi1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL21haW4tbmF2LmpzIiwiZGlyZWN0aXZlcy9zYXZlLWNhbmNlbC1kaXJlY3RpdmUuanMiLCJqcy9tYWluLmpzIiwic2VydmljZXMvYm9vay1mYWN0b3J5LmpzIiwic2VydmljZXMvYm9va3MtZmFjdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicsIFsnbmdSb3V0ZSddKS5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xyXG4gICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9ib29rcydcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va3NDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va3NDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9zZWFyY2gnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL3NlYXJjaC9pbmRleC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NlYXJjaENvbnRyb2xsZXInXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Jvb2tzLzppZC9pbmZvJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9kZXRhaWxzL2luZm8uaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rSW5mb0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rSW5mb0N0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Jvb2tzLzppZC9hYnN0cmFjdCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZGV0YWlscy9hYnN0cmFjdC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tBYnN0cmFjdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rQWJzdHJDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvY29udGVudCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZGV0YWlscy9jb250ZW50Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va0NvbnRlbnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va0NvbnRDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvZWRpdCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZWRpdC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tFZGl0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tFZGl0Q3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vdGhlcndpc2Uoe1xyXG4gICAgICAgICAgICByZWRpcmVjdFRvOiAnL2Jvb2tzJ1xyXG4gICAgICAgIH0pXHJcbn1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tBYnN0cmFjdENvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQm9vaycsICdCb29rcycsIGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9vaywgQm9va3MpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG4gICAgICAgICRzY29wZS5jdXJyZW50VGFiID0gJ2Fic3RyJztcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzQ3VycmVudCA9IGZ1bmN0aW9uICh0YWIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5jdXJyZW50VGFiID09PSB0YWI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQgPSB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdxdW90ZScsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6ICcnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmFkZEFic3RySXRlbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5hYnN0ckl0ZW1Ub0FkZC5jb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmFic3RySXRlbVRvQWRkLnR5cGUgPT09ICdyZXZpZXcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJvb2sucmV2aWV3ID0gJHNjb3BlLmFic3RySXRlbVRvQWRkLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXMucHVzaCgkc2NvcGUuYWJzdHJJdGVtVG9BZGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdxdW90ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJydcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Ym9vayA9IG5ldyBCb29rKCRzY29wZS5ib29rKTtcclxuICAgICAgICAgICAgY3VycmVudGJvb2sudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rQ29udGVudENvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQm9vaycsICdCb29rcycsIGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9vaywgQm9va3MpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG4gICAgICAgICRzY29wZS5jdXJyZW50VGFiID0gJ2NvbnQnO1xyXG5cclxuICAgICAgICAkc2NvcGUuaXNDdXJyZW50ID0gZnVuY3Rpb24gKHRhYikge1xyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLmN1cnJlbnRUYWIgPT09IHRhYjtcclxuICAgICAgICB9XHJcbn1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tFZGl0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdCb29rJywgJ0Jvb2tzJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBCb29rLCBCb29rcykge1xyXG5cclxuICAgICAgICAkc2NvcGUuYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7XHJcblxyXG4gICAgICAgICRzY29wZS5lZGl0ZWRCb29rSW5mbyA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHBhcmFtIGluICRzY29wZS5ib29rKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lZGl0ZWRCb29rSW5mb1twYXJhbV0gPSAkc2NvcGUuYm9va1twYXJhbV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuYmFja1VybCA9ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2luZm8nO1xyXG4gICAgICAgICRzY29wZS5zYXZlQ2hhbmdlcyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHBhcmFtIGluICRzY29wZS5lZGl0ZWRCb29rSW5mbykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmJvb2tbcGFyYW1dID0gJHNjb3BlLmVkaXRlZEJvb2tJbmZvW3BhcmFtXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIG5ldyBCb29rKCRzY29wZS5ib29rKS51cGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va0luZm9Db250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0Jvb2snLCAnQm9va3MnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2ssIEJvb2tzKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuICAgICAgICAkc2NvcGUuY3VycmVudFRhYiA9ICdpbmZvJztcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzQ3VycmVudCA9IGZ1bmN0aW9uICh0YWIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5jdXJyZW50VGFiID09PSB0YWI7XHJcbiAgICAgICAgfVxyXG5cclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va3NDb250cm9sbGVyJywgWyckc2NvcGUnLCAnQm9va3MnLCAnQm9vaycsIGZ1bmN0aW9uICgkc2NvcGUsIEJvb2tzLCBCb29rKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rcyA9IEJvb2tzLmdldEFsbEJvb2tzKCk7XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpLmNvbnRyb2xsZXIoJ1NlYXJjaENvbnRyb2xsZXInLCBbJyRzY29wZScsICdCb29rcycsICdCb29rJywgZnVuY3Rpb24gKCRzY29wZSwgQm9va3MsIEJvb2spIHtcclxuICAgIFxyXG4gICAgJHNjb3BlLmJvb2tzID0gQm9va3MuZ2V0QWxsQm9va3MoKTtcclxuXHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdkZXRhaWxzRmxhZ3MnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvZGV0YWlscy1mbGFncy5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRyb3V0ZVBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvVXJsOiAnIy9ib29rcy8nICsgJHJvdXRlUGFyYW1zLmlkICsgJy9pbmZvJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VXJsOiAnIy9ib29rcy8nICsgJHJvdXRlUGFyYW1zLmlkICsgJy9jb250ZW50JyxcclxuICAgICAgICAgICAgICAgICAgICBhYnN0cmFjdFVybDogJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvYWJzdHJhY3QnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdmbGFnc0N0cmwnXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdlZGl0RGVsZXRlQnRuJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL2VkaXQtZGVsZXRlLWJ0bi5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRyb3V0ZVBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0UGFnZVVybDogJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvZWRpdCdcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2VkaXREZWxDdHJsJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnbWFpbk5hdicsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9tYWluLW5hdi5odG1sJyxcclxuICAgICAgICAgICAgc2NvcGU6IHRydWUsXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jbGFzcyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmZpbmQoXCJhLmJ0bi1tZW51XCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuY2xhc3MgPT0gXCJcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbGFzcyA9IFwiYWN0aXZlXCJcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xhc3MgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0pOyAgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbikge1xyXG4gICAgICAgICAgICAgICAkc2NvcGUuaXNBY3RpdmUgPSBmdW5jdGlvbiAodmlld0xvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2aWV3TG9jYXRpb24gPT09ICRsb2NhdGlvbi5wYXRoKCk7XHJcbiAgICAgICAgICAgICAgICB9OyAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pOyIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ3NhdmVDYW5jZWxCdG4nLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvc2F2ZS1jYW5jZWwtYnRuLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHJvdXRlUGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tVcmw6ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2luZm8nXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdzYXZlQ2FuY2VsQ3RybCdcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkYXNpZGVsaW5rID0gJCgnLmFzaWRlLWxpbmsnKSwgJHdyYXBzaWRlYmFyID0gJCgnLmNvbnRlbnQnKSwgJGJ0bm1lbnUgPSAkKCcuYnRuLW1lbnUnKTtcclxuICAgICRhc2lkZWxpbmsuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRhc2lkZWxpbmsudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICR3cmFwc2lkZWJhci50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICBcclxuXHJcbn0pO1xyXG4gICAgIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5mYWN0b3J5KCdCb29rJywgZnVuY3Rpb24gQm9va0ZhY3RvcnkoKSB7XHJcblxyXG4gICAgdmFyIEJvb2tGYWN0b3J5ID0gZnVuY3Rpb24gKG9iaikge1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gb2JqLmlkO1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSBvYmoudGl0bGUgfHwgbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKG9iai5hdXRob3IpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShvYmouYXV0aG9yKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRob3IgPSBvYmouYXV0aG9yLmpvaW4oJywgJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhvciA9IG9iai5hdXRob3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhvciA9IG9iai5hdXRob3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmltYWdlID0gb2JqLmltYWdlIHx8IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChvYmouY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShvYmouY2F0ZWdvcnkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhdGVnb3J5ID0gb2JqLmNhdGVnb3J5LmpvaW4oJywgJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhdGVnb3J5ID0gb2JqLmNhdGVnb3J5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXRlZ29yeSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnB1Ymxpc2hlciA9IG9iai5wdWJsaXNoZXIgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLnB1YmxpY2F0aW9uRGF0ZSA9IG9iai5wdWJsaWNhdGlvbkRhdGUgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IG9iai5sZW5ndGggfHwgbnVsbDtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gb2JqLmRlc2NyaXB0aW9uIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5yZXZpZXcgPSBvYmoucmV2aWV3IHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5hYnN0cmFjdEl0ZW1zID0gb2JqLmFic3RyYWN0SXRlbXMgfHwgW107XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBjdXJyZW50Qm9va3MgPSBbXTtcclxuXHJcbiAgICBCb29rRmFjdG9yeS5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpIHtcclxuICAgICAgICAgICAgY3VycmVudEJvb2tzID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRCb29rcy5wdXNoKHRoaXMpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdib29rcycsIGFuZ3VsYXIudG9Kc29uKGN1cnJlbnRCb29rcykpO1xyXG4gICAgfTtcclxuXHJcbiAgICBCb29rRmFjdG9yeS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgICAgaXNOZXcgPSB0cnVlO1xyXG4gICAgICAgIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpIHtcclxuICAgICAgICAgICAgdGhhdC5zYXZlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3VycmVudEJvb2tzID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChjdXJyZW50Qm9va3MsIGZ1bmN0aW9uIChvYmosIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLmlkID09IHRoYXQuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godGhhdCwgZnVuY3Rpb24gKHZhbHVlLCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcGVydHldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jvb2tzJywgYW5ndWxhci50b0pzb24oY3VycmVudEJvb2tzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNOZXcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChpc05ldykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5zYXZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIEJvb2tGYWN0b3J5LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2RlbGV0ZScpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gQm9va0ZhY3Rvcnk7XHJcbn0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpLmZhY3RvcnkoJ0Jvb2tzJywgZnVuY3Rpb24gQm9va3NGYWN0b3J5KCRodHRwLCBCb29rKSB7XHJcbiAgICB2YXIgZmFjdG9yeSA9IHt9O1xyXG5cclxuICAgIGZhY3RvcnkuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmF3Qm9va3NBcnJheSA9ICRodHRwLmdldChcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2Jvb2tzL3YxL3VzZXJzLzExNDg3MzIyOTI0MDMzNjM1MDEzNC9ib29rc2hlbHZlcy8wL3ZvbHVtZXNcIik7XHJcbiAgICAgICAgcmF3Qm9va3NBcnJheS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICB2YXIgYm9vaywgZWxtLCBvYmosIGFwcEJvb2tzID0gcmVzcG9uc2UuaXRlbXM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGFwcEJvb2tzKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBhcHBCb29rc1twcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICBvYmogPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGVsbS5pZCxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZWxtLnZvbHVtZUluZm8udGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yOiBlbG0udm9sdW1lSW5mby5hdXRob3JzLFxyXG4gICAgICAgICAgICAgICAgICAgIHB1Ymxpc2hlcjogZWxtLnZvbHVtZUluZm8ucHVibGlzaGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uRGF0ZTogZWxtLnZvbHVtZUluZm8ucHVibGlzaGVkRGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogZWxtLnZvbHVtZUluZm8uaW1hZ2VMaW5rcy50aHVtYm5haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IGVsbS52b2x1bWVJbmZvLmNhdGVnb3JpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoOiBlbG0udm9sdW1lSW5mby5wYWdlQ291bnQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGVsbS52b2x1bWVJbmZvLmRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib29rID0gbmV3IEJvb2sob2JqKTtcclxuICAgICAgICAgICAgICAgIGJvb2sudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKSB7XHJcblx0XHRcdGZhY3RvcnkuaW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pKCk7XHJcblxyXG5cclxuICAgIGZhY3RvcnkuZ2V0QWxsQm9va3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgfTtcclxuICAgIGZhY3RvcnkuZ2V0Qm9va0J5SUQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICB2YXIgYm9va3MgPSBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvb2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChib29rc1tpXS5pZCA9PT0gaWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBib29rc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGZhY3Rvcnk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zY3JpcHRzIn0=