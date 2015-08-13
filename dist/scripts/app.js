angular.module('bookman', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/pages/books/index.html',
            controller: 'BooksController'
        })
        .when('/search', {
            templateUrl: 'templates/pages/search/index.html',
            controller: 'SearchController'
        })
        .when('/book/:id', {
            templateUrl: '/bookDetails.html',
            controller: 'BooksDetailController'
        })
        .when('/:alias', {
            templateUrl: '/singePage.html',
            controller: 'SingePageController'
        });
}]);

angular.module('bookman').controller('BooksDetailController', ['$scope', '$routeParams', 'Books', function ($scope, $routeParams, Books) {
	$scope.book = Books.getBookByID($routeParams.id);
}]);

angular.module('bookman').controller('BooksController', ['$scope', 'Books', 'Book', function ($scope, Books, Book) {

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
    
angular.module('bookman').factory('Book', function BookFactory( ) {
    var BookFactory = function (obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.author = obj.author;
        this.image = obj.image;
        this.category = obj.category;
    };
    var currentBooks = [];
    BookFactory.prototype.save = function () {
        if (sessionStorage.getItem('books')) {
            currentBooks = angular.fromJson(sessionStorage.getItem('books'));
        }
        currentBooks.push(this);
        sessionStorage.setItem('books', angular.toJson(currentBooks));
    };
    BookFactory.prototype.update = function () {
        var that = this,
            isNew = true;
        if (!sessionStorage.getItem('books')) {
            that.save();
        } else {
            currentBooks = angular.fromJson(sessionStorage.getItem('books'));
            angular.forEach(currentBooks, function(obj, index){
                if (obj.id == that.id) {
                    angular.forEach(that, function(value, property){                     
                        obj[property] = value;                      
                    });
                    sessionStorage.setItem('books', angular.toJson(currentBooks));
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

angular.module('bookman').factory('Books', function BookFactory($http, Book) {
    var factory = {};

    factory.init = function () {
        return $http.get("https://www.googleapis.com/books/v1/users/114873229240336350134/bookshelves/0/volumes");
    };
    factory.getAllBooks = function () {
        return angular.fromJson(sessionStorage.getItem('books'));
    };
    factory.getBookByID = function (id) {
        var books = angular.fromJson(sessionStorage.getItem('books'));
        return books[id];
    };

    factory.init().success(function (response) {
       var book, elm, obj, appBooks = response.items;
        for (var property in appBooks) {
            elm = appBooks[property];
            obj = {
                id: elm.id,
                title: elm.volumeInfo.title,
                author: elm.volumeInfo.authors[0],
                image: elm.volumeInfo.imageLinks.thumbnail,
                category: elm.volumeInfo.categories[0]
            }
            book = new Book(obj);
            book.update();
        }
    });
    return factory;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL2Jvb2stZGV0YWlscy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYm9va3MtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXJjaC1jb250cm9sbGVyLmpzIiwianMvbWFpbi5qcyIsInNlcnZpY2VzL2Jvb2stZmFjdG9yeS5qcyIsInNlcnZpY2VzL2Jvb2tzLWZhY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJywgWyduZ1JvdXRlJ10pLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9pbmRleC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rc0NvbnRyb2xsZXInXG4gICAgICAgIH0pXG4gICAgICAgIC53aGVuKCcvc2VhcmNoJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvc2VhcmNoL2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NlYXJjaENvbnRyb2xsZXInXG4gICAgICAgIH0pXG4gICAgICAgIC53aGVuKCcvYm9vay86aWQnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9ib29rRGV0YWlscy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rc0RldGFpbENvbnRyb2xsZXInXG4gICAgICAgIH0pXG4gICAgICAgIC53aGVuKCcvOmFsaWFzJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc2luZ2VQYWdlLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NpbmdlUGFnZUNvbnRyb2xsZXInXG4gICAgICAgIH0pO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5jb250cm9sbGVyKCdCb29rc0RldGFpbENvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQm9va3MnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2tzKSB7XG5cdCRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuY29udHJvbGxlcignQm9va3NDb250cm9sbGVyJywgWyckc2NvcGUnLCAnQm9va3MnLCAnQm9vaycsIGZ1bmN0aW9uICgkc2NvcGUsIEJvb2tzLCBCb29rKSB7XG5cbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpLmNvbnRyb2xsZXIoJ1NlYXJjaENvbnRyb2xsZXInLCBbJyRzY29wZScsICdCb29rcycsICdCb29rJywgZnVuY3Rpb24gKCRzY29wZSwgQm9va3MsIEJvb2spIHtcbiAgICBcbiAgICAkc2NvcGUuYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpO1xuXG59XSk7IiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIHZhciAkYXNpZGVsaW5rID0gJCgnLmFzaWRlLWxpbmsnKSwgJHdyYXBzaWRlYmFyID0gJCgnLmNvbnRlbnQnKSwgJGJ0bm1lbnUgPSAkKCcuYnRuLW1lbnUnKTtcbiAgICAkYXNpZGVsaW5rLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGFzaWRlbGluay50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICR3cmFwc2lkZWJhci50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICAkYnRubWVudS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICRidG5tZW51LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgJGJ0bm1lbnUubmV4dCgpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG59KTtcbiAgICAiLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpLmZhY3RvcnkoJ0Jvb2snLCBmdW5jdGlvbiBCb29rRmFjdG9yeSggKSB7XG4gICAgdmFyIEJvb2tGYWN0b3J5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICB0aGlzLmlkID0gb2JqLmlkO1xuICAgICAgICB0aGlzLnRpdGxlID0gb2JqLnRpdGxlO1xuICAgICAgICB0aGlzLmF1dGhvciA9IG9iai5hdXRob3I7XG4gICAgICAgIHRoaXMuaW1hZ2UgPSBvYmouaW1hZ2U7XG4gICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBvYmouY2F0ZWdvcnk7XG4gICAgfTtcbiAgICB2YXIgY3VycmVudEJvb2tzID0gW107XG4gICAgQm9va0ZhY3RvcnkucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKSB7XG4gICAgICAgICAgICBjdXJyZW50Qm9va3MgPSBhbmd1bGFyLmZyb21Kc29uKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRCb29rcy5wdXNoKHRoaXMpO1xuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdib29rcycsIGFuZ3VsYXIudG9Kc29uKGN1cnJlbnRCb29rcykpO1xuICAgIH07XG4gICAgQm9va0ZhY3RvcnkucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgaXNOZXcgPSB0cnVlO1xuICAgICAgICBpZiAoIXNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpIHtcbiAgICAgICAgICAgIHRoYXQuc2F2ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudEJvb2tzID0gYW5ndWxhci5mcm9tSnNvbihzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChjdXJyZW50Qm9va3MsIGZ1bmN0aW9uKG9iaiwgaW5kZXgpe1xuICAgICAgICAgICAgICAgIGlmIChvYmouaWQgPT0gdGhhdC5pZCkge1xuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godGhhdCwgZnVuY3Rpb24odmFsdWUsIHByb3BlcnR5KXsgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wZXJ0eV0gPSB2YWx1ZTsgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdib29rcycsIGFuZ3VsYXIudG9Kc29uKGN1cnJlbnRCb29rcykpO1xuICAgICAgICAgICAgICAgICAgICBpc05ldyA9IGZhbHNlOyBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChpc05ldykge1xuICAgICAgICAgICAgICAgIHRoYXQuc2F2ZSgpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH07XG4gICAgQm9va0ZhY3RvcnkucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2RlbGV0ZScpO1xuICAgIH07XG4gICAgcmV0dXJuIEJvb2tGYWN0b3J5O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpLmZhY3RvcnkoJ0Jvb2tzJywgZnVuY3Rpb24gQm9va0ZhY3RvcnkoJGh0dHAsIEJvb2spIHtcbiAgICB2YXIgZmFjdG9yeSA9IHt9O1xuXG4gICAgZmFjdG9yeS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYm9va3MvdjEvdXNlcnMvMTE0ODczMjI5MjQwMzM2MzUwMTM0L2Jvb2tzaGVsdmVzLzAvdm9sdW1lc1wiKTtcbiAgICB9O1xuICAgIGZhY3RvcnkuZ2V0QWxsQm9va3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xuICAgIH07XG4gICAgZmFjdG9yeS5nZXRCb29rQnlJRCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICB2YXIgYm9va3MgPSBhbmd1bGFyLmZyb21Kc29uKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xuICAgICAgICByZXR1cm4gYm9va3NbaWRdO1xuICAgIH07XG5cbiAgICBmYWN0b3J5LmluaXQoKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgIHZhciBib29rLCBlbG0sIG9iaiwgYXBwQm9va3MgPSByZXNwb25zZS5pdGVtcztcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYXBwQm9va3MpIHtcbiAgICAgICAgICAgIGVsbSA9IGFwcEJvb2tzW3Byb3BlcnR5XTtcbiAgICAgICAgICAgIG9iaiA9IHtcbiAgICAgICAgICAgICAgICBpZDogZWxtLmlkLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBlbG0udm9sdW1lSW5mby50aXRsZSxcbiAgICAgICAgICAgICAgICBhdXRob3I6IGVsbS52b2x1bWVJbmZvLmF1dGhvcnNbMF0sXG4gICAgICAgICAgICAgICAgaW1hZ2U6IGVsbS52b2x1bWVJbmZvLmltYWdlTGlua3MudGh1bWJuYWlsLFxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBlbG0udm9sdW1lSW5mby5jYXRlZ29yaWVzWzBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBib29rID0gbmV3IEJvb2sob2JqKTtcbiAgICAgICAgICAgIGJvb2sudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZmFjdG9yeTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc2NyaXB0cyJ9