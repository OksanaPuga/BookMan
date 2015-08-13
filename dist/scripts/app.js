angular.module('bookman', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/pages/books/index.html',
            controller: 'BooksController',
            controllerAs: 'booksCtrl'
        })
        .when('/search', {
            templateUrl: 'templates/pages/search/index.html',
            controller: 'SearchController'
        })
        .when('/books/:id', {
            templateUrl: '/templates/pages/books/details.html',
            controller: 'BookDetailsController',
            controllerAs: 'bookDetCtrl'
        })
        //.when('/:alias', {
        //    templateUrl: '/singePage.html',
        //    controller: 'SingePageController'
        //});
}]);

angular.module('bookman')
    .controller('BookDetailsController', ['$scope', '$routeParams', 'Books', function ($scope, $routeParams, Books) {

        $scope.book = Books.getBookByID($routeParams.id);
        console.log($scope.book);
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

angular.module('bookman').factory('Books', function BooksFactory($http, Book) {
    var factory = {};

    factory.init = function () {
        return $http.get("https://www.googleapis.com/books/v1/users/114873229240336350134/bookshelves/0/volumes");
    };
    factory.getAllBooks = function () {
        return angular.fromJson(sessionStorage.getItem('books'));
    };
    factory.getBookByID = function (id) {
        var books = angular.fromJson(sessionStorage.getItem('books'));
        for (var i = 0; i < books.length; i++) {
            if (books[i].id === id) {
                return books[i];
            }
        }
    };

    factory.init().success(function (response) {
        var book, elm, obj, appBooks = response.items;
        for (var property in appBooks) {
            elm = appBooks[property];
            obj = {
                id: elm.id,
                title: elm.volumeInfo.title,
                author: elm.volumeInfo.authors[0],
                publisher: elm.volumeInfo.publisher,
                publicationDate: elm.volumeInfo.publishedDate,
                image: elm.volumeInfo.imageLinks.thumbnail,
                
                length: elm.volumeInfo.pageCount,
                description: elm.volumeInfo.description
            }
            book = new Book(obj);
            book.update();
        }
    });
    return factory;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL2Jvb2stZGV0YWlscy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYm9va3MtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXJjaC1jb250cm9sbGVyLmpzIiwianMvbWFpbi5qcyIsInNlcnZpY2VzL2Jvb2stZmFjdG9yeS5qcyIsInNlcnZpY2VzL2Jvb2tzLWZhY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicsIFsnbmdSb3V0ZSddKS5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xyXG4gICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rc0N0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL3NlYXJjaCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvc2VhcmNoL2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU2VhcmNoQ29udHJvbGxlcidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MvOmlkJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy90ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZGV0YWlscy5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tEZXRhaWxzQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tEZXRDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLy8ud2hlbignLzphbGlhcycsIHtcclxuICAgICAgICAvLyAgICB0ZW1wbGF0ZVVybDogJy9zaW5nZVBhZ2UuaHRtbCcsXHJcbiAgICAgICAgLy8gICAgY29udHJvbGxlcjogJ1NpbmdlUGFnZUNvbnRyb2xsZXInXHJcbiAgICAgICAgLy99KTtcclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va0RldGFpbHNDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0Jvb2tzJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBCb29rcykge1xyXG5cclxuICAgICAgICAkc2NvcGUuYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmJvb2spO1xyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rc0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdCb29rcycsICdCb29rJywgZnVuY3Rpb24gKCRzY29wZSwgQm9va3MsIEJvb2spIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2tzID0gQm9va3MuZ2V0QWxsQm9va3MoKTtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuY29udHJvbGxlcignU2VhcmNoQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0Jvb2tzJywgJ0Jvb2snLCBmdW5jdGlvbiAoJHNjb3BlLCBCb29rcywgQm9vaykge1xyXG4gICAgXHJcbiAgICAkc2NvcGUuYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpO1xyXG5cclxufV0pOyIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkYXNpZGVsaW5rID0gJCgnLmFzaWRlLWxpbmsnKSwgJHdyYXBzaWRlYmFyID0gJCgnLmNvbnRlbnQnKSwgJGJ0bm1lbnUgPSAkKCcuYnRuLW1lbnUnKTtcclxuICAgICRhc2lkZWxpbmsuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRhc2lkZWxpbmsudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICR3cmFwc2lkZWJhci50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICAkYnRubWVudS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJGJ0bm1lbnUudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICRidG5tZW51Lm5leHQoKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcblxyXG59KTtcclxuICAgICIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuZmFjdG9yeSgnQm9vaycsIGZ1bmN0aW9uIEJvb2tGYWN0b3J5KCApIHtcclxuICAgIHZhciBCb29rRmFjdG9yeSA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICB0aGlzLmlkID0gb2JqLmlkO1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSBvYmoudGl0bGU7XHJcbiAgICAgICAgdGhpcy5hdXRob3IgPSBvYmouYXV0aG9yO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBvYmouaW1hZ2U7XHJcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IG9iai5jYXRlZ29yeTtcclxuICAgIH07XHJcbiAgICB2YXIgY3VycmVudEJvb2tzID0gW107XHJcbiAgICBCb29rRmFjdG9yeS5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSkge1xyXG4gICAgICAgICAgICBjdXJyZW50Qm9va3MgPSBhbmd1bGFyLmZyb21Kc29uKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50Qm9va3MucHVzaCh0aGlzKTtcclxuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdib29rcycsIGFuZ3VsYXIudG9Kc29uKGN1cnJlbnRCb29rcykpO1xyXG4gICAgfTtcclxuICAgIEJvb2tGYWN0b3J5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgICBpc05ldyA9IHRydWU7XHJcbiAgICAgICAgaWYgKCFzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKSB7XHJcbiAgICAgICAgICAgIHRoYXQuc2F2ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRCb29rcyA9IGFuZ3VsYXIuZnJvbUpzb24oc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChjdXJyZW50Qm9va3MsIGZ1bmN0aW9uKG9iaiwgaW5kZXgpe1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5pZCA9PSB0aGF0LmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRoYXQsIGZ1bmN0aW9uKHZhbHVlLCBwcm9wZXJ0eSl7ICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wZXJ0eV0gPSB2YWx1ZTsgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYm9va3MnLCBhbmd1bGFyLnRvSnNvbihjdXJyZW50Qm9va3MpKTtcclxuICAgICAgICAgICAgICAgICAgICBpc05ldyA9IGZhbHNlOyBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChpc05ldykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5zYXZlKCk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIEJvb2tGYWN0b3J5LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2RlbGV0ZScpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBCb29rRmFjdG9yeTtcclxufSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuZmFjdG9yeSgnQm9va3MnLCBmdW5jdGlvbiBCb29rc0ZhY3RvcnkoJGh0dHAsIEJvb2spIHtcclxuICAgIHZhciBmYWN0b3J5ID0ge307XHJcblxyXG4gICAgZmFjdG9yeS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9ib29rcy92MS91c2Vycy8xMTQ4NzMyMjkyNDAzMzYzNTAxMzQvYm9va3NoZWx2ZXMvMC92b2x1bWVzXCIpO1xyXG4gICAgfTtcclxuICAgIGZhY3RvcnkuZ2V0QWxsQm9va3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24oc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICB9O1xyXG4gICAgZmFjdG9yeS5nZXRCb29rQnlJRCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIHZhciBib29rcyA9IGFuZ3VsYXIuZnJvbUpzb24oc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib29rcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoYm9va3NbaV0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYm9va3NbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZhY3RvcnkuaW5pdCgpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgdmFyIGJvb2ssIGVsbSwgb2JqLCBhcHBCb29rcyA9IHJlc3BvbnNlLml0ZW1zO1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGFwcEJvb2tzKSB7XHJcbiAgICAgICAgICAgIGVsbSA9IGFwcEJvb2tzW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgb2JqID0ge1xyXG4gICAgICAgICAgICAgICAgaWQ6IGVsbS5pZCxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBlbG0udm9sdW1lSW5mby50aXRsZSxcclxuICAgICAgICAgICAgICAgIGF1dGhvcjogZWxtLnZvbHVtZUluZm8uYXV0aG9yc1swXSxcclxuICAgICAgICAgICAgICAgIHB1Ymxpc2hlcjogZWxtLnZvbHVtZUluZm8ucHVibGlzaGVyLFxyXG4gICAgICAgICAgICAgICAgcHVibGljYXRpb25EYXRlOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZWREYXRlLFxyXG4gICAgICAgICAgICAgICAgaW1hZ2U6IGVsbS52b2x1bWVJbmZvLmltYWdlTGlua3MudGh1bWJuYWlsLFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsZW5ndGg6IGVsbS52b2x1bWVJbmZvLnBhZ2VDb3VudCxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBlbG0udm9sdW1lSW5mby5kZXNjcmlwdGlvblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJvb2sgPSBuZXcgQm9vayhvYmopO1xyXG4gICAgICAgICAgICBib29rLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGZhY3Rvcnk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zY3JpcHRzIn0=