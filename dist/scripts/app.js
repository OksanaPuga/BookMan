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
        $scope.infoUrl = '#/books/' + $routeParams.id + '/info';
        $scope.contentUrl = '#/books/' + $routeParams.id + '/content';

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
        $scope.infoUrl = '#/books/' + $routeParams.id + '/info';
        $scope.abstractUrl = '#/books/' + $routeParams.id + '/abstract';

        $scope.isCurrent = function (tab) {
            return $scope.currentTab === tab;
        }
}]);

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

angular.module('bookman')
    .controller('BookInfoController', ['$scope', '$routeParams', 'Book', 'Books', function ($scope, $routeParams, Book, Books) {

        $scope.book = Books.getBookByID($routeParams.id);
        $scope.currentTab = 'info';
        $scope.abstractUrl = '#/books/' + $routeParams.id + '/abstract';
        $scope.contentUrl = '#/books/' + $routeParams.id + '/content';

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
            templateUrl: 'templates/directives/details-flags.html'
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWJzdHJhY3QtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stY29udGVudC1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYm9vay1kZXRhaWxzLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rLWVkaXQtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2staW5mby1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYm9va3MtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXJjaC1jb250cm9sbGVyLmpzIiwiZGlyZWN0aXZlcy9kZXRhaWxzLWZsYWdzLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvbWFpbi1uYXYuanMiLCJqcy9tYWluLmpzIiwic2VydmljZXMvYm9vay1mYWN0b3J5LmpzIiwic2VydmljZXMvYm9va3MtZmFjdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicsIFsnbmdSb3V0ZSddKS5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xyXG4gICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9ib29rcydcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va3NDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va3NDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9zZWFyY2gnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL3NlYXJjaC9pbmRleC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NlYXJjaENvbnRyb2xsZXInXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Jvb2tzLzppZC9pbmZvJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9kZXRhaWxzL2luZm8uaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rSW5mb0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rSW5mb0N0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Jvb2tzLzppZC9hYnN0cmFjdCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZGV0YWlscy9hYnN0cmFjdC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tBYnN0cmFjdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rQWJzdHJDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvY29udGVudCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZGV0YWlscy9jb250ZW50Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va0NvbnRlbnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va0NvbnRDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvZWRpdCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZWRpdC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tFZGl0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tFZGl0Q3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vdGhlcndpc2Uoe1xyXG4gICAgICAgICAgICByZWRpcmVjdFRvOiAnL2Jvb2tzJ1xyXG4gICAgICAgIH0pXHJcbn1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tBYnN0cmFjdENvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQm9vaycsICdCb29rcycsIGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9vaywgQm9va3MpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG4gICAgICAgICRzY29wZS5jdXJyZW50VGFiID0gJ2Fic3RyJztcclxuICAgICAgICAkc2NvcGUuaW5mb1VybCA9ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2luZm8nO1xyXG4gICAgICAgICRzY29wZS5jb250ZW50VXJsID0gJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvY29udGVudCc7XHJcblxyXG4gICAgICAgICRzY29wZS5pc0N1cnJlbnQgPSBmdW5jdGlvbiAodGFiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuY3VycmVudFRhYiA9PT0gdGFiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAncXVvdGUnLFxyXG4gICAgICAgICAgICBjb250ZW50OiAnJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5hZGRBYnN0ckl0ZW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUuYWJzdHJJdGVtVG9BZGQuY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5hYnN0ckl0ZW1Ub0FkZC50eXBlID09PSAncmV2aWV3Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5ib29rLnJldmlldyA9ICRzY29wZS5hYnN0ckl0ZW1Ub0FkZC5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zLnB1c2goJHNjb3BlLmFic3RySXRlbVRvQWRkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZCA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncXVvdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICcnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudGJvb2sgPSBuZXcgQm9vaygkc2NvcGUuYm9vayk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRib29rLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va0NvbnRlbnRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0Jvb2snLCAnQm9va3MnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2ssIEJvb2tzKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuICAgICAgICAkc2NvcGUuY3VycmVudFRhYiA9ICdjb250JztcclxuICAgICAgICAkc2NvcGUuaW5mb1VybCA9ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2luZm8nO1xyXG4gICAgICAgICRzY29wZS5hYnN0cmFjdFVybCA9ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2Fic3RyYWN0JztcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzQ3VycmVudCA9IGZ1bmN0aW9uICh0YWIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5jdXJyZW50VGFiID09PSB0YWI7XHJcbiAgICAgICAgfVxyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rRGV0YWlsc0NvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQm9vaycsICdCb29rcycsIGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9vaywgQm9va3MpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG4gICAgICAgICRzY29wZS5jdXJyZW50VGFiID0gJ2luZm8nO1xyXG5cclxuICAgICAgICAkc2NvcGUuY2hhbmdlVGFiID0gZnVuY3Rpb24gKHRhYikge1xyXG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFRhYiA9IHRhYjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5pc0N1cnJlbnQgPSBmdW5jdGlvbiAodGFiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuY3VycmVudFRhYiA9PT0gdGFiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAncXVvdGUnLFxyXG4gICAgICAgICAgICBjb250ZW50OiAnJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5hZGRBYnN0ckl0ZW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUuYWJzdHJJdGVtVG9BZGQuY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5hYnN0ckl0ZW1Ub0FkZC50eXBlID09PSAncmV2aWV3Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5ib29rLnJldmlldyA9ICRzY29wZS5hYnN0ckl0ZW1Ub0FkZC5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zLnB1c2goJHNjb3BlLmFic3RySXRlbVRvQWRkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZCA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncXVvdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICcnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudGJvb2sgPSBuZXcgQm9vaygkc2NvcGUuYm9vayk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRib29rLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va0VkaXRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0Jvb2snLCAnQm9va3MnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2ssIEJvb2tzKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmVkaXRlZEJvb2tJbmZvID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgcGFyYW0gaW4gJHNjb3BlLmJvb2spIHtcclxuICAgICAgICAgICAgJHNjb3BlLmVkaXRlZEJvb2tJbmZvW3BhcmFtXSA9ICRzY29wZS5ib29rW3BhcmFtXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5iYWNrVXJsID0gJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZDtcclxuICAgICAgICAkc2NvcGUuc2F2ZUNoYW5nZXMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBwYXJhbSBpbiAkc2NvcGUuZWRpdGVkQm9va0luZm8pIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5ib29rW3BhcmFtXSA9ICRzY29wZS5lZGl0ZWRCb29rSW5mb1twYXJhbV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICBuZXcgQm9vaygkc2NvcGUuYm9vaykudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tJbmZvQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdCb29rJywgJ0Jvb2tzJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBCb29rLCBCb29rcykge1xyXG5cclxuICAgICAgICAkc2NvcGUuYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRUYWIgPSAnaW5mbyc7XHJcbiAgICAgICAgJHNjb3BlLmFic3RyYWN0VXJsID0gJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvYWJzdHJhY3QnO1xyXG4gICAgICAgICRzY29wZS5jb250ZW50VXJsID0gJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvY29udGVudCc7XHJcblxyXG4gICAgICAgICRzY29wZS5pc0N1cnJlbnQgPSBmdW5jdGlvbiAodGFiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuY3VycmVudFRhYiA9PT0gdGFiO1xyXG4gICAgICAgIH1cclxuXHJcbn1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0Jvb2tzJywgJ0Jvb2snLCBmdW5jdGlvbiAoJHNjb3BlLCBCb29rcywgQm9vaykge1xyXG5cclxuICAgICAgICAkc2NvcGUuYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpO1xyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5jb250cm9sbGVyKCdTZWFyY2hDb250cm9sbGVyJywgWyckc2NvcGUnLCAnQm9va3MnLCAnQm9vaycsIGZ1bmN0aW9uICgkc2NvcGUsIEJvb2tzLCBCb29rKSB7XHJcbiAgICBcclxuICAgICRzY29wZS5ib29rcyA9IEJvb2tzLmdldEFsbEJvb2tzKCk7XHJcblxyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnZGV0YWlsc0ZsYWdzJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL2RldGFpbHMtZmxhZ3MuaHRtbCdcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ21haW5OYXYnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvbWFpbi1uYXYuaHRtbCcsXHJcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xhc3MgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5maW5kKFwiYS5idG4tbWVudVwiKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmNsYXNzID09IFwiXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xhc3MgPSBcImFjdGl2ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsYXNzID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KTsgICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24pIHtcclxuICAgICAgICAgICAgICAgJHNjb3BlLmlzQWN0aXZlID0gZnVuY3Rpb24gKHZpZXdMb2NhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmlld0xvY2F0aW9uID09PSAkbG9jYXRpb24ucGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgfTsgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgJGFzaWRlbGluayA9ICQoJy5hc2lkZS1saW5rJyksICR3cmFwc2lkZWJhciA9ICQoJy5jb250ZW50JyksICRidG5tZW51ID0gJCgnLmJ0bi1tZW51Jyk7XHJcbiAgICAkYXNpZGVsaW5rLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkYXNpZGVsaW5rLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAkd3JhcHNpZGViYXIudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG4gICAgXHJcblxyXG59KTtcclxuICAgICIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuZmFjdG9yeSgnQm9vaycsIGZ1bmN0aW9uIEJvb2tGYWN0b3J5KCkge1xyXG5cclxuICAgIHZhciBCb29rRmFjdG9yeSA9IGZ1bmN0aW9uIChvYmopIHtcclxuXHJcbiAgICAgICAgdGhpcy5pZCA9IG9iai5pZDtcclxuICAgICAgICB0aGlzLnRpdGxlID0gb2JqLnRpdGxlIHx8IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChvYmouYXV0aG9yKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkob2JqLmF1dGhvcikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aG9yID0gb2JqLmF1dGhvci5qb2luKCcsICcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRob3IgPSBvYmouYXV0aG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hdXRob3IgPSBvYmouYXV0aG9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IG9iai5pbWFnZSB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZiAob2JqLmNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkob2JqLmNhdGVnb3J5KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeSA9IG9iai5jYXRlZ29yeS5qb2luKCcsICcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeSA9IG9iai5jYXRlZ29yeTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wdWJsaXNoZXIgPSBvYmoucHVibGlzaGVyIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5wdWJsaWNhdGlvbkRhdGUgPSBvYmoucHVibGljYXRpb25EYXRlIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBvYmoubGVuZ3RoIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IG9iai5kZXNjcmlwdGlvbiB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMucmV2aWV3ID0gb2JqLnJldmlldyB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuYWJzdHJhY3RJdGVtcyA9IG9iai5hYnN0cmFjdEl0ZW1zIHx8IFtdO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgY3VycmVudEJvb2tzID0gW107XHJcblxyXG4gICAgQm9va0ZhY3RvcnkucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRCb29rcyA9IGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50Qm9va3MucHVzaCh0aGlzKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYm9va3MnLCBhbmd1bGFyLnRvSnNvbihjdXJyZW50Qm9va3MpKTtcclxuICAgIH07XHJcblxyXG4gICAgQm9va0ZhY3RvcnkucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAgIGlzTmV3ID0gdHJ1ZTtcclxuICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKSB7XHJcbiAgICAgICAgICAgIHRoYXQuc2F2ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRCb29rcyA9IGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goY3VycmVudEJvb2tzLCBmdW5jdGlvbiAob2JqLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5pZCA9PSB0aGF0LmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRoYXQsIGZ1bmN0aW9uICh2YWx1ZSwgcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdib29rcycsIGFuZ3VsYXIudG9Kc29uKGN1cnJlbnRCb29rcykpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzTmV3ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoaXNOZXcpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuc2F2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBCb29rRmFjdG9yeS5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdkZWxldGUnKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIEJvb2tGYWN0b3J5O1xyXG59KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5mYWN0b3J5KCdCb29rcycsIGZ1bmN0aW9uIEJvb2tzRmFjdG9yeSgkaHR0cCwgQm9vaykge1xyXG4gICAgdmFyIGZhY3RvcnkgPSB7fTtcclxuXHJcbiAgICBmYWN0b3J5LmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJhd0Jvb2tzQXJyYXkgPSAkaHR0cC5nZXQoXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9ib29rcy92MS91c2Vycy8xMTQ4NzMyMjkyNDAzMzYzNTAxMzQvYm9va3NoZWx2ZXMvMC92b2x1bWVzXCIpO1xyXG4gICAgICAgIHJhd0Jvb2tzQXJyYXkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdmFyIGJvb2ssIGVsbSwgb2JqLCBhcHBCb29rcyA9IHJlc3BvbnNlLml0ZW1zO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBhcHBCb29rcykge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gYXBwQm9va3NbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgb2JqID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBlbG0uaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGVsbS52b2x1bWVJbmZvLnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvcjogZWxtLnZvbHVtZUluZm8uYXV0aG9ycyxcclxuICAgICAgICAgICAgICAgICAgICBwdWJsaXNoZXI6IGVsbS52b2x1bWVJbmZvLnB1Ymxpc2hlcixcclxuICAgICAgICAgICAgICAgICAgICBwdWJsaWNhdGlvbkRhdGU6IGVsbS52b2x1bWVJbmZvLnB1Ymxpc2hlZERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGVsbS52b2x1bWVJbmZvLmltYWdlTGlua3MudGh1bWJuYWlsLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBlbG0udm9sdW1lSW5mby5jYXRlZ29yaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aDogZWxtLnZvbHVtZUluZm8ucGFnZUNvdW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBlbG0udm9sdW1lSW5mby5kZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYm9vayA9IG5ldyBCb29rKG9iaik7XHJcbiAgICAgICAgICAgICAgICBib29rLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSkge1xyXG5cdFx0XHRmYWN0b3J5LmluaXQoKTtcclxuICAgICAgICB9XHJcbiAgICB9KSgpO1xyXG5cclxuXHJcbiAgICBmYWN0b3J5LmdldEFsbEJvb2tzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcclxuICAgIH07XHJcbiAgICBmYWN0b3J5LmdldEJvb2tCeUlEID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgdmFyIGJvb2tzID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib29rcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoYm9va3NbaV0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYm9va3NbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBmYWN0b3J5O1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc2NyaXB0cyJ9