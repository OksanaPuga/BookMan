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
        .when('/books/:id', {
            templateUrl: 'templates/pages/books/details.html',
            controller: 'BookDetailsController',
            controllerAs: 'bookDetCtrl'
        })
        .when('/books/:id/edit', {
            templateUrl: 'templates/pages/books/edit.html',
            controller: 'BookEditController',
            controllerAs: 'bookEditCtrl'
        })
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
    .controller('BooksController', ['$scope', 'Books', 'Book', function ($scope, Books, Book) {

        $scope.books = Books.getAllBooks();

    }]);

angular.module('bookman').controller('SearchController', ['$scope', 'Books', 'Book', function ($scope, Books, Book) {
    
    $scope.books = Books.getAllBooks();

}]);
$(document).ready(function () {
    var $asidelink = $('.aside-link'), $wrapsidebar = $('.content'), $btnmenu = $('.btn-menu');
    $asidelink.click(function () {
        $asidelink.toggleClass('active');
        $wrapsidebar.toggleClass('active');
        return false;
    });
    $btnmenu.click(function () {
        $btnmenu.toggleClass('active');
        $btnmenu.next().toggleClass('active');
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
        this.review = null;
        this.abstractItems = [];
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


    factory.init();



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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL2Jvb2stZGV0YWlscy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYm9vay1lZGl0LWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rcy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvc2VhcmNoLWNvbnRyb2xsZXIuanMiLCJqcy9tYWluLmpzIiwic2VydmljZXMvYm9vay1mYWN0b3J5LmpzIiwic2VydmljZXMvYm9va3MtZmFjdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nLCBbJ25nUm91dGUnXSkuY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvYm9va3MnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Jvb2tzJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9pbmRleC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tzQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tzQ3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvc2VhcmNoJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9zZWFyY2gvaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZWFyY2hDb250cm9sbGVyJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2RldGFpbHMuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rRGV0YWlsc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rRGV0Q3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MvOmlkL2VkaXQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2VkaXQuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rRWRpdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rRWRpdEN0cmwnXHJcbiAgICAgICAgfSlcclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va0RldGFpbHNDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0Jvb2snLCAnQm9va3MnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2ssIEJvb2tzKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuICAgICAgICAkc2NvcGUuY3VycmVudFRhYiA9ICdpbmZvJztcclxuXHJcbiAgICAgICAgJHNjb3BlLmNoYW5nZVRhYiA9IGZ1bmN0aW9uICh0YWIpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRUYWIgPSB0YWI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuaXNDdXJyZW50ID0gZnVuY3Rpb24gKHRhYikge1xyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLmN1cnJlbnRUYWIgPT09IHRhYjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZCA9IHtcclxuICAgICAgICAgICAgdHlwZTogJ3F1b3RlJyxcclxuICAgICAgICAgICAgY29udGVudDogJydcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuYWRkQWJzdHJJdGVtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmFic3RySXRlbVRvQWRkLmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuYWJzdHJJdGVtVG9BZGQudHlwZSA9PT0gJ3JldmlldycpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYm9vay5yZXZpZXcgPSAkc2NvcGUuYWJzdHJJdGVtVG9BZGQuY29udGVudDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJvb2suYWJzdHJhY3RJdGVtcy5wdXNoKCRzY29wZS5hYnN0ckl0ZW1Ub0FkZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3F1b3RlJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAnJ1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRib29rID0gbmV3IEJvb2soJHNjb3BlLmJvb2spO1xyXG4gICAgICAgICAgICBjdXJyZW50Ym9vay51cGRhdGUoKTtcclxuICAgICAgICB9XHJcbn1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tFZGl0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdCb29rJywgJ0Jvb2tzJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBCb29rLCBCb29rcykge1xyXG5cclxuICAgICAgICAkc2NvcGUuYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7XHJcblxyXG4gICAgICAgICRzY29wZS5lZGl0ZWRCb29rSW5mbyA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHBhcmFtIGluICRzY29wZS5ib29rKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lZGl0ZWRCb29rSW5mb1twYXJhbV0gPSAkc2NvcGUuYm9va1twYXJhbV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuYmFja1VybCA9ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQ7XHJcbiAgICAgICAgJHNjb3BlLnNhdmVDaGFuZ2VzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgcGFyYW0gaW4gJHNjb3BlLmVkaXRlZEJvb2tJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYm9va1twYXJhbV0gPSAkc2NvcGUuZWRpdGVkQm9va0luZm9bcGFyYW1dO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgbmV3IEJvb2soJHNjb3BlLmJvb2spLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rc0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdCb29rcycsICdCb29rJywgZnVuY3Rpb24gKCRzY29wZSwgQm9va3MsIEJvb2spIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2tzID0gQm9va3MuZ2V0QWxsQm9va3MoKTtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuY29udHJvbGxlcignU2VhcmNoQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0Jvb2tzJywgJ0Jvb2snLCBmdW5jdGlvbiAoJHNjb3BlLCBCb29rcywgQm9vaykge1xyXG4gICAgXHJcbiAgICAkc2NvcGUuYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpO1xyXG5cclxufV0pOyIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkYXNpZGVsaW5rID0gJCgnLmFzaWRlLWxpbmsnKSwgJHdyYXBzaWRlYmFyID0gJCgnLmNvbnRlbnQnKSwgJGJ0bm1lbnUgPSAkKCcuYnRuLW1lbnUnKTtcclxuICAgICRhc2lkZWxpbmsuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRhc2lkZWxpbmsudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICR3cmFwc2lkZWJhci50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICAkYnRubWVudS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJGJ0bm1lbnUudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICRidG5tZW51Lm5leHQoKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcblxyXG59KTtcclxuICAgICIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuZmFjdG9yeSgnQm9vaycsIGZ1bmN0aW9uIEJvb2tGYWN0b3J5KCkge1xyXG5cclxuICAgIHZhciBCb29rRmFjdG9yeSA9IGZ1bmN0aW9uIChvYmopIHtcclxuXHJcbiAgICAgICAgdGhpcy5pZCA9IG9iai5pZDtcclxuICAgICAgICB0aGlzLnRpdGxlID0gb2JqLnRpdGxlIHx8IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChvYmouYXV0aG9yKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkob2JqLmF1dGhvcikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aG9yID0gb2JqLmF1dGhvci5qb2luKCcsICcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRob3IgPSBvYmouYXV0aG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hdXRob3IgPSBvYmouYXV0aG9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IG9iai5pbWFnZSB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZiAob2JqLmNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkob2JqLmNhdGVnb3J5KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeSA9IG9iai5jYXRlZ29yeS5qb2luKCcsICcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeSA9IG9iai5jYXRlZ29yeTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wdWJsaXNoZXIgPSBvYmoucHVibGlzaGVyIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5wdWJsaWNhdGlvbkRhdGUgPSBvYmoucHVibGljYXRpb25EYXRlIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBvYmoubGVuZ3RoIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IG9iai5kZXNjcmlwdGlvbiB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMucmV2aWV3ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmFic3RyYWN0SXRlbXMgPSBbXTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGN1cnJlbnRCb29rcyA9IFtdO1xyXG5cclxuICAgIEJvb2tGYWN0b3J5LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSkge1xyXG4gICAgICAgICAgICBjdXJyZW50Qm9va3MgPSBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3VycmVudEJvb2tzLnB1c2godGhpcyk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jvb2tzJywgYW5ndWxhci50b0pzb24oY3VycmVudEJvb2tzKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIEJvb2tGYWN0b3J5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgICBpc05ldyA9IHRydWU7XHJcbiAgICAgICAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSkge1xyXG4gICAgICAgICAgICB0aGF0LnNhdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdXJyZW50Qm9va3MgPSBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGN1cnJlbnRCb29rcywgZnVuY3Rpb24gKG9iaiwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmouaWQgPT0gdGhhdC5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0aGF0LCBmdW5jdGlvbiAodmFsdWUsIHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wZXJ0eV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYm9va3MnLCBhbmd1bGFyLnRvSnNvbihjdXJyZW50Qm9va3MpKTtcclxuICAgICAgICAgICAgICAgICAgICBpc05ldyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKGlzTmV3KSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnNhdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgQm9va0ZhY3RvcnkucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnZGVsZXRlJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBCb29rRmFjdG9yeTtcclxufSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuZmFjdG9yeSgnQm9va3MnLCBmdW5jdGlvbiBCb29rc0ZhY3RvcnkoJGh0dHAsIEJvb2spIHtcclxuICAgIHZhciBmYWN0b3J5ID0ge307XHJcblxyXG4gICAgZmFjdG9yeS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByYXdCb29rc0FycmF5ID0gJGh0dHAuZ2V0KFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYm9va3MvdjEvdXNlcnMvMTE0ODczMjI5MjQwMzM2MzUwMTM0L2Jvb2tzaGVsdmVzLzAvdm9sdW1lc1wiKTtcclxuICAgICAgICByYXdCb29rc0FycmF5LnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHZhciBib29rLCBlbG0sIG9iaiwgYXBwQm9va3MgPSByZXNwb25zZS5pdGVtcztcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYXBwQm9va3MpIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGFwcEJvb2tzW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgIG9iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogZWxtLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBlbG0udm9sdW1lSW5mby50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICBhdXRob3I6IGVsbS52b2x1bWVJbmZvLmF1dGhvcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgcHVibGlzaGVyOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgcHVibGljYXRpb25EYXRlOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZWREYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlOiBlbG0udm9sdW1lSW5mby5pbWFnZUxpbmtzLnRodW1ibmFpbCxcclxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogZWxtLnZvbHVtZUluZm8uY2F0ZWdvcmllcyxcclxuICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IGVsbS52b2x1bWVJbmZvLnBhZ2VDb3VudCxcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZWxtLnZvbHVtZUluZm8uZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJvb2sgPSBuZXcgQm9vayhvYmopO1xyXG4gICAgICAgICAgICAgICAgYm9vay51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgZmFjdG9yeS5pbml0KCk7XHJcblxyXG5cclxuXHJcbiAgICBmYWN0b3J5LmdldEFsbEJvb2tzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcclxuICAgIH07XHJcbiAgICBmYWN0b3J5LmdldEJvb2tCeUlEID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgdmFyIGJvb2tzID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib29rcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoYm9va3NbaV0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYm9va3NbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBmYWN0b3J5O1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc2NyaXB0cyJ9