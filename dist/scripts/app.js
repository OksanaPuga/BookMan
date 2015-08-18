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
        .when('/statistics', {
            templateUrl: 'templates/pages/statistics/index.html',
            controller: 'StatisticsController'
        })
        .when('/add', {
            templateUrl: 'templates/pages/books/add.html',
            controller: 'BookAddController',
            controllerAs: 'bookAddCtrl'
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

        $scope.typesToShow = {
            quotes: true,
            notes: true,
            review: true
        }

        $scope.abstrItemToAdd = {
            type: 'quote',
            content: '',
            index: null
        };

        $scope.isCurrent = function (tab) {
            return $scope.currentTab === tab;
        };


        $scope.increaseNotesAmount = function () {
            $scope.book.notesAmount++;
        };
        $scope.increaseQuotesAmount = function () {
            $scope.book.quotesAmount++;
        };
        $scope.decreaseNotesAmount = function () {
            $scope.book.notesAmount--;
        };
        $scope.decreaseQuotesAmount = function () {
            $scope.book.quotesAmount--;
        }


        $scope.showAllAbstract = function () {
            $scope.typesToShow = {
                quotes: true,
                notes: true,
                review: true
            }
        };

        $scope.toggleButtons = function ($event) {
            var target = $event.currentTarget;
            console.log(target);

            if (!$(target).hasClass('opened')) {
                $('article').removeClass('opened');
            }
            $(target).toggleClass('opened');
        };


        $scope.updateBookAbstr = function () {
            $scope.book.modified = new Date();
            var currentbook = new Book($scope.book);
            currentbook.update();
        };

        $scope.addAbstrItem = function () {

            var editedItem = $scope.abstrItemToAdd,
                currentItem = $scope.book.abstractItems[$scope.abstrItemToAdd.index];

            if (editedItem.content) {
                if (editedItem.index === null) {
                    if (editedItem.type === 'review') {
                        $scope.book.review = editedItem.content;
                    } else {
                        $scope.book.abstractItems.push(editedItem);
                        if (editedItem.type === 'quote') {
                            $scope.increaseQuotesAmount();
                        } else {
                            $scope.increaseNotesAmount();
                        }
                    }
                } else {
                    if (currentItem.type === 'note' && editedItem.type === 'quote') {
                        $scope.decreaseNotesAmount();
                        $scope.increaseQuotesAmount();
                    } else if (currentItem.type === 'quote' && editedItem.type === 'note') {
                        $scope.decreaseQuotesAmount();
                        $scope.increaseNotesAmount();
                    } else if (editedItem.type === 'review') {
                        $scope.book.review = editedItem.content;
                        $scope.deleteAbstrItem(editedItem.index);
                        $scope.abstrItemToAdd = {
                            type: 'quote',
                            content: '',
                            index: null
                        };
                        return;
                    }
                    currentItem.content = editedItem.content;
                    currentItem.type = editedItem.type;
                }
                $scope.abstrItemToAdd = {
                    type: 'quote',
                    content: '',
                    index: null
                };

                $scope.updateBookAbstr();
            }
        };

        $scope.editAbstrItem = function ($index) {
            $scope.abstrItemToAdd.type = $scope.book.abstractItems[$index].type;
            $scope.abstrItemToAdd.content = $scope.book.abstractItems[$index].content;
            $scope.abstrItemToAdd.index = $index;
            
            window.scrollTo(0,0);
            $('textarea').focus();

            $scope.updateBookAbstr();
        };

        $scope.deleteAbstrItem = function ($index) {
            if ($scope.book.abstractItems[$index].type === 'quote') {
                $scope.decreaseQuotesAmount();
            } else if ($scope.book.abstractItems[$index].type === 'note') {
                $scope.decreaseNotesAmount();
            }
            $scope.book.abstractItems.splice([$index], 1);

            $scope.updateBookAbstr();
        };

        $scope.editReview = function () {
            $scope.abstrItemToAdd.type = 'review';
            $scope.abstrItemToAdd.content = $scope.book.review;
            
            window.scrollTo(0,0);
            $('textarea').focus();

            $scope.updateBookAbstr();
        };

        $scope.deleteReview = function () {
            $scope.book.review = null;
            $scope.updateBookAbstr();
        };
}]);

angular.module('bookman')
    .controller('BookAddController', ['$scope', 'Book', 'Books', function ($scope, Book, Books) {

        $scope.generateId = function () {
            var randomId = '';
            for (var i = 0; i < 12; i++) {
                randomId += Math.ceil(Math.random() * 9);
            }
            return randomId;
        }

        $scope.book = {};

        $scope.addBook = function () {
            if ($scope.book.rate) {
                $scope.book.rate = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'].slice(0, $scope.book.rate);
                // for iterating rate-stars
                // this code looks pretty strange, but it is the easiest helper for ng-repeat which I've discovered
            }
            $scope.book.id = $scope.generateId();
            new Book($scope.book).save();
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

        if (angular.isArray($scope.editedBookInfo.rate)) {
            $scope.editedBookInfo.rate = $scope.editedBookInfo.rate.length;
        }

        $scope.saveChanges = function () {

            if ($scope.editedBookInfo.rate) {
                $scope.editedBookInfo.rate = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'].slice(0, $scope.editedBookInfo.rate);
                // for iterating rate-stars
                // this code looks pretty strange, but it is the easiest helper for ng-repeat which I've discovered
            }

            for (var param in $scope.editedBookInfo) {
                $scope.book[param] = $scope.editedBookInfo[param];
            }

            $scope.book.modified = new Date();
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

angular.module('bookman')
    .controller('randomQuoteController', ['Books', '$routeParams', function (Books, $routeParams) {
        var controller = this;
        controller.book = Books.getBookByID($routeParams.id);
        controller.quotesAmount = controller.book.quotesAmount;
        controller.quotes = [];
        controller.randomQuote = 'kaka';

        controller.book.abstractItems.forEach(function (item) {
            if (item.type === 'quote') {
                controller.quotes.push(item.content);
            }
        });

        controller.chooseRandomQuote = function () {
            var randomIndex = Math.floor(Math.random() * controller.quotesAmount);
            controller.randomQuote = controller.quotes[randomIndex];
        };
        controller.chooseRandomQuote();
        setInterval(controller.chooseRandomQuote, 1000);

    }]);

angular.module('bookman').controller('SearchController', ['$scope', '$http', 'Books', 'Book', function ($scope, $http, Books, Book) {
	$scope.submitSearch = function (form) {
		if (form.$valid) {
			var url;
			$scope.tempBooks = [];
			$scope.indicesAdded = [];
			
			if ($scope.searchParam.byTerm == "all"){
				url = "https://www.googleapis.com/books/v1/volumes?q="+$scope.searchParam.text+"&maxResults=20";
			} else {
				url = "https://www.googleapis.com/books/v1/volumes?q="+$scope.searchParam.byTerm+":"+$scope.searchParam.text+"&maxResults=20";
			}
			$http.get(url).success(function (response) {
				if (response.totalItems > 0){
					var elm, obj, appBooks = response.items;
					for (var property in appBooks) {
						elm = appBooks[property];
						obj = {
							id: elm.id,
							title: elm.volumeInfo.title,
							author: elm.volumeInfo.authors||"",
							image: elm.volumeInfo.imageLinks ? elm.volumeInfo.imageLinks.thumbnail : Books.defaultcover,
							publisher: elm.volumeInfo.publisher,
							publicationDate: elm.volumeInfo.publishedDate,
							category: elm.volumeInfo.categories,
							length: elm.volumeInfo.pageCount,
							description: elm.volumeInfo.description,
							isAdded : false
						}
						if (Books.getBookByID(elm.id)){
							obj.isAdded = true;
						}
						$scope.tempBooks.push(obj);
					}
					$scope.addBook = function(index, book) {
						$scope.tempBooks[index].isAdded = true;  				
						var newBook = new Book(book);
						newBook.save();
					}
					$scope.noResults = false;
				} else {
					$scope.noResults = true;
				}
			});
		}
	}
}]);

angular.module('bookman').controller('StatisticsController', ['$scope', 'Books', 'Book', function ($scope, Books, Book) {
	var books = Books.getAllBooks(),
		sumQuotes = 0,
		sumNotes = 0,
		sumReview = 0,
		sumBooksQuotes = 0,
		sumBooksNotes = 0,
		amountPages = 0,
		avarageQuotes,
		avarageNotes;
	

	angular.forEach(books, function (obj) {
		if (obj.quotesAmount) {
			sumBooksQuotes++;
			sumQuotes += obj.quotesAmount;
		}
		
		if (obj.notesAmount) {
			sumBooksNotes++;
			sumNotes += obj.notesAmount;
		}

		if (obj.review){
			sumReview++;
		}

		if(obj.length){
			amountPages += obj.length;
		}		
	});

	avarageQuotes = parseInt( sumQuotes / books.length);
	avarageNotes = parseInt( sumNotes / books.length);

	$scope.statistics = {
		amountBooks: books.length,
		avarageNotes: avarageNotes,
		sumBooksNotes: sumBooksNotes,
		avarageQuotes: avarageQuotes,		
		sumBooksQuotes: sumBooksQuotes,
		quotesAmountAll: sumQuotes,
		notesAmountAll: sumNotes,
		reviewAmountAll: sumReview	
	};
	$scope.books = books;

	$scope.getRandom = function(min,max){
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	$scope.booksHeight = parseInt(amountPages * 0.3 / 10);

}]);

angular.module('bookman')
    .directive('addCancelBtn', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/add-cancel-btn.html'
        };
    });

angular.module('bookman')
    .directive('addedModified', function () {

        return {
            restrict: 'E',
            templateUrl: 'templates/directives/added-modified-section.html',
        }

    });

angular.module('bookman')
    .directive('bookSearchSection', function () {

        return {
            restrict: 'E',
            templateUrl: 'templates/directives/book-search-section.html',
        }

    });

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
    .directive('filterAbstract', function () {

        return {
            restrict: 'E',
            templateUrl: 'templates/directives/filter-abstr.html',
        }

    });

angular.module('bookman')
    .directive('mainNav', [ '$location', function($location){
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/main-nav.html',
            scope: {},
            link: function(scope, element, attrs) {
                scope.isActiveClass = false;
                scope.openMenu = function() {
                    scope.isActiveClass = !scope.isActiveClass;
                } 
                scope.isActive = function (viewLocation) {
                     return viewLocation === $location.path();
                };          
            }
        }
    }]);
angular.module('bookman')
    .directive('openAsideBtn', ['$rootScope', function(rootScope){
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/open-aside-btn.html',
            scope: {},
            link: function(scope, element, attrs) {
                scope.isActiveClass = false;
                rootScope.isActiveClassContent = false;
                scope.openAside = function() {
                   scope.isActiveClass = !scope.isActiveClass;
                   rootScope.isActiveClassContent = !rootScope.isActiveClassContent
                }     
            }
        }
    }]);


angular.module('bookman')
    .directive('quickStatistics', function () {

        return {
            restrict: 'E',
            templateUrl: 'templates/directives/quick-statistics.html',
        }

    });

angular.module('bookman')
    .directive('randomQuote', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/random-quote.html',
            controller: 'randomQuoteController',
            controllerAs: 'quoteCtrl'
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

angular.module('bookman')
    .directive('statisticsSection', ['Books', function (Books) {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/statistics-section.html',
            controller: function () {
                this.books = Books.getAllBooks();
            },
            controllerAs: 'statSecCtrl'
        };
    }]);

angular.module('bookman')
    .filter('abstractFilter', function () {
        return function (items, typesToShow) {
            var filtered = [];

            angular.forEach(items, function (item) {
                if (typesToShow.quotes && typesToShow.notes) {
                    filtered.push(item);
                } else if (!typesToShow.quotes && typesToShow.notes && item.type === 'note') {
                    filtered.push(item);
                } else if (typesToShow.quotes && !typesToShow.notes && item.type === 'quote') {
                    filtered.push(item);
                }
            });

            return filtered;
        };
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
            this.author = null;
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
        this.rate = obj.rate || null;
        this.description = obj.description || null;
        this.review = obj.review || null;
        this.abstractItems = obj.abstractItems || [];
        this.quotesAmount = obj.quotesAmount || 0;
        this.notesAmount = obj.notesAmount || 0;

        if (!obj.added) {
            this.added = new Date();
        }

        this.modified = obj.modified || new Date();
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
    factory.defaultcover = "images/The_Book_(Front_Cover).jpg";
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWJzdHJhY3QtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWRkLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rLWNvbnRlbnQtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stZWRpdC1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYm9vay1pbmZvLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rcy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcmFuZG9tLXF1b3Rlcy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvc2VhcmNoLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9zdGF0aXN0aWNzLWNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL2FkZC1jYW5jZWwtYnRuLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvYWRkZWQtbW9kaWZpZWQtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9ib29rLXNlYXJjaC1zZWN0aW9uLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvZGV0YWlscy1mbGFncy1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL2VkaXQtZGVsZXRlLWJ0bi1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL2ZpbHRlci1hYnN0cmFjdC1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL21haW4tbmF2LWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvb3Blbi1hc2lkZS1idG4tZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9xdWljay1zdGF0aXN0aWNzLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvcmFuZG9tLXF1b3RlLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvc2F2ZS1jYW5jZWwtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9zdGF0aXN0aWNzLXNlY3Rpb24tZGlyZWN0aXZlLmpzIiwiZmlsdGVycy9hYnN0cmFjdC1maWx0ZXIuanMiLCJzZXJ2aWNlcy9ib29rLWZhY3RvcnkuanMiLCJzZXJ2aWNlcy9ib29rcy1mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nLCBbJ25nUm91dGUnXSkuY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvYm9va3MnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Jvb2tzJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9pbmRleC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tzQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tzQ3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvc2VhcmNoJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9zZWFyY2gvaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZWFyY2hDb250cm9sbGVyJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9zdGF0aXN0aWNzJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9zdGF0aXN0aWNzL2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU3RhdGlzdGljc0NvbnRyb2xsZXInXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2FkZCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvYWRkLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va0FkZENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rQWRkQ3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MvOmlkL2luZm8nLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2RldGFpbHMvaW5mby5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tJbmZvQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tJbmZvQ3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MvOmlkL2Fic3RyYWN0Jywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9kZXRhaWxzL2Fic3RyYWN0Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va0Fic3RyYWN0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tBYnN0ckN0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Jvb2tzLzppZC9jb250ZW50Jywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9kZXRhaWxzL2NvbnRlbnQuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQ29udGVudENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rQ29udEN0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Jvb2tzLzppZC9lZGl0Jywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9lZGl0Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va0VkaXRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va0VkaXRDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm90aGVyd2lzZSh7XHJcbiAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvYm9va3MnXHJcbiAgICAgICAgfSlcclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va0Fic3RyYWN0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdCb29rJywgJ0Jvb2tzJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBCb29rLCBCb29rcykge1xyXG5cclxuICAgICAgICAkc2NvcGUuYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRUYWIgPSAnYWJzdHInO1xyXG5cclxuICAgICAgICAkc2NvcGUudHlwZXNUb1Nob3cgPSB7XHJcbiAgICAgICAgICAgIHF1b3RlczogdHJ1ZSxcclxuICAgICAgICAgICAgbm90ZXM6IHRydWUsXHJcbiAgICAgICAgICAgIHJldmlldzogdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAncXVvdGUnLFxyXG4gICAgICAgICAgICBjb250ZW50OiAnJyxcclxuICAgICAgICAgICAgaW5kZXg6IG51bGxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuaXNDdXJyZW50ID0gZnVuY3Rpb24gKHRhYikge1xyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLmN1cnJlbnRUYWIgPT09IHRhYjtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgJHNjb3BlLmluY3JlYXNlTm90ZXNBbW91bnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLm5vdGVzQW1vdW50Kys7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc2NvcGUuaW5jcmVhc2VRdW90ZXNBbW91bnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLnF1b3Rlc0Ftb3VudCsrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHNjb3BlLmRlY3JlYXNlTm90ZXNBbW91bnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLm5vdGVzQW1vdW50LS07XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc2NvcGUuZGVjcmVhc2VRdW90ZXNBbW91bnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLnF1b3Rlc0Ftb3VudC0tO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICRzY29wZS5zaG93QWxsQWJzdHJhY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS50eXBlc1RvU2hvdyA9IHtcclxuICAgICAgICAgICAgICAgIHF1b3RlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG5vdGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmV2aWV3OiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUudG9nZ2xlQnV0dG9ucyA9IGZ1bmN0aW9uICgkZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldCA9ICRldmVudC5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkKHRhcmdldCkuaGFzQ2xhc3MoJ29wZW5lZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdhcnRpY2xlJykucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICQodGFyZ2V0KS50b2dnbGVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgICRzY29wZS51cGRhdGVCb29rQWJzdHIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLm1vZGlmaWVkID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRib29rID0gbmV3IEJvb2soJHNjb3BlLmJvb2spO1xyXG4gICAgICAgICAgICBjdXJyZW50Ym9vay51cGRhdGUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuYWRkQWJzdHJJdGVtID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGVkaXRlZEl0ZW0gPSAkc2NvcGUuYWJzdHJJdGVtVG9BZGQsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50SXRlbSA9ICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXNbJHNjb3BlLmFic3RySXRlbVRvQWRkLmluZGV4XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlZGl0ZWRJdGVtLmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlZGl0ZWRJdGVtLmluZGV4ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkaXRlZEl0ZW0udHlwZSA9PT0gJ3JldmlldycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJvb2sucmV2aWV3ID0gZWRpdGVkSXRlbS5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXMucHVzaChlZGl0ZWRJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVkaXRlZEl0ZW0udHlwZSA9PT0gJ3F1b3RlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmluY3JlYXNlUXVvdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5jcmVhc2VOb3Rlc0Ftb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEl0ZW0udHlwZSA9PT0gJ25vdGUnICYmIGVkaXRlZEl0ZW0udHlwZSA9PT0gJ3F1b3RlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGVjcmVhc2VOb3Rlc0Ftb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5jcmVhc2VRdW90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRJdGVtLnR5cGUgPT09ICdxdW90ZScgJiYgZWRpdGVkSXRlbS50eXBlID09PSAnbm90ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRlY3JlYXNlUXVvdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmNyZWFzZU5vdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlZGl0ZWRJdGVtLnR5cGUgPT09ICdyZXZpZXcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5ib29rLnJldmlldyA9IGVkaXRlZEl0ZW0uY29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRlbGV0ZUFic3RySXRlbShlZGl0ZWRJdGVtLmluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3F1b3RlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SXRlbS5jb250ZW50ID0gZWRpdGVkSXRlbS5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJdGVtLnR5cGUgPSBlZGl0ZWRJdGVtLnR5cGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3F1b3RlJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAnJyxcclxuICAgICAgICAgICAgICAgICAgICBpbmRleDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlQm9va0Fic3RyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuZWRpdEFic3RySXRlbSA9IGZ1bmN0aW9uICgkaW5kZXgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkLnR5cGUgPSAkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zWyRpbmRleF0udHlwZTtcclxuICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkLmNvbnRlbnQgPSAkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zWyRpbmRleF0uY29udGVudDtcclxuICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkLmluZGV4ID0gJGluZGV4O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsMCk7XHJcbiAgICAgICAgICAgICQoJ3RleHRhcmVhJykuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVCb29rQWJzdHIoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuZGVsZXRlQWJzdHJJdGVtID0gZnVuY3Rpb24gKCRpbmRleCkge1xyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmJvb2suYWJzdHJhY3RJdGVtc1skaW5kZXhdLnR5cGUgPT09ICdxdW90ZScpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5kZWNyZWFzZVF1b3Rlc0Ftb3VudCgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRzY29wZS5ib29rLmFic3RyYWN0SXRlbXNbJGluZGV4XS50eXBlID09PSAnbm90ZScpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5kZWNyZWFzZU5vdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHNjb3BlLmJvb2suYWJzdHJhY3RJdGVtcy5zcGxpY2UoWyRpbmRleF0sIDEpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUJvb2tBYnN0cigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5lZGl0UmV2aWV3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQudHlwZSA9ICdyZXZpZXcnO1xyXG4gICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQuY29udGVudCA9ICRzY29wZS5ib29rLnJldmlldztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLDApO1xyXG4gICAgICAgICAgICAkKCd0ZXh0YXJlYScpLmZvY3VzKCk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlQm9va0Fic3RyKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmRlbGV0ZVJldmlldyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2sucmV2aWV3ID0gbnVsbDtcclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUJvb2tBYnN0cigpO1xyXG4gICAgICAgIH07XHJcbn1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tBZGRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnQm9vaycsICdCb29rcycsIGZ1bmN0aW9uICgkc2NvcGUsIEJvb2ssIEJvb2tzKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5nZW5lcmF0ZUlkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcmFuZG9tSWQgPSAnJztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByYW5kb21JZCArPSBNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSAqIDkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByYW5kb21JZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0ge307XHJcblxyXG4gICAgICAgICRzY29wZS5hZGRCb29rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmJvb2sucmF0ZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmJvb2sucmF0ZSA9IFsnMSBzdGFyJywgJzIgc3RhcnMnLCAnMyBzdGFycycsICc0IHN0YXJzJywgJzUgc3RhcnMnXS5zbGljZSgwLCAkc2NvcGUuYm9vay5yYXRlKTtcclxuICAgICAgICAgICAgICAgIC8vIGZvciBpdGVyYXRpbmcgcmF0ZS1zdGFyc1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGxvb2tzIHByZXR0eSBzdHJhbmdlLCBidXQgaXQgaXMgdGhlIGVhc2llc3QgaGVscGVyIGZvciBuZy1yZXBlYXQgd2hpY2ggSSd2ZSBkaXNjb3ZlcmVkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHNjb3BlLmJvb2suaWQgPSAkc2NvcGUuZ2VuZXJhdGVJZCgpO1xyXG4gICAgICAgICAgICBuZXcgQm9vaygkc2NvcGUuYm9vaykuc2F2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rQ29udGVudENvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQm9vaycsICdCb29rcycsIGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9vaywgQm9va3MpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG4gICAgICAgICRzY29wZS5jdXJyZW50VGFiID0gJ2NvbnQnO1xyXG5cclxuICAgICAgICAkc2NvcGUuaXNDdXJyZW50ID0gZnVuY3Rpb24gKHRhYikge1xyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLmN1cnJlbnRUYWIgPT09IHRhYjtcclxuICAgICAgICB9XHJcbn1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tFZGl0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdCb29rJywgJ0Jvb2tzJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBCb29rLCBCb29rcykge1xyXG5cclxuICAgICAgICAkc2NvcGUuYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7XHJcblxyXG4gICAgICAgICRzY29wZS5lZGl0ZWRCb29rSW5mbyA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHBhcmFtIGluICRzY29wZS5ib29rKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lZGl0ZWRCb29rSW5mb1twYXJhbV0gPSAkc2NvcGUuYm9va1twYXJhbV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KCRzY29wZS5lZGl0ZWRCb29rSW5mby5yYXRlKSkge1xyXG4gICAgICAgICAgICAkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSA9ICRzY29wZS5lZGl0ZWRCb29rSW5mby5yYXRlLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5zYXZlQ2hhbmdlcyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnJhdGUgPSBbJzEgc3RhcicsICcyIHN0YXJzJywgJzMgc3RhcnMnLCAnNCBzdGFycycsICc1IHN0YXJzJ10uc2xpY2UoMCwgJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnJhdGUpO1xyXG4gICAgICAgICAgICAgICAgLy8gZm9yIGl0ZXJhdGluZyByYXRlLXN0YXJzXHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgbG9va3MgcHJldHR5IHN0cmFuZ2UsIGJ1dCBpdCBpcyB0aGUgZWFzaWVzdCBoZWxwZXIgZm9yIG5nLXJlcGVhdCB3aGljaCBJJ3ZlIGRpc2NvdmVyZWRcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgcGFyYW0gaW4gJHNjb3BlLmVkaXRlZEJvb2tJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYm9va1twYXJhbV0gPSAkc2NvcGUuZWRpdGVkQm9va0luZm9bcGFyYW1dO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5tb2RpZmllZCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIG5ldyBCb29rKCRzY29wZS5ib29rKS51cGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va0luZm9Db250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0Jvb2snLCAnQm9va3MnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2ssIEJvb2tzKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuICAgICAgICAkc2NvcGUuY3VycmVudFRhYiA9ICdpbmZvJztcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzQ3VycmVudCA9IGZ1bmN0aW9uICh0YWIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5jdXJyZW50VGFiID09PSB0YWI7XHJcbiAgICAgICAgfVxyXG5cclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va3NDb250cm9sbGVyJywgWyckc2NvcGUnLCAnQm9va3MnLCAnQm9vaycsIGZ1bmN0aW9uICgkc2NvcGUsIEJvb2tzLCBCb29rKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rcyA9IEJvb2tzLmdldEFsbEJvb2tzKCk7XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcigncmFuZG9tUXVvdGVDb250cm9sbGVyJywgWydCb29rcycsICckcm91dGVQYXJhbXMnLCBmdW5jdGlvbiAoQm9va3MsICRyb3V0ZVBhcmFtcykge1xyXG4gICAgICAgIHZhciBjb250cm9sbGVyID0gdGhpcztcclxuICAgICAgICBjb250cm9sbGVyLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIucXVvdGVzQW1vdW50ID0gY29udHJvbGxlci5ib29rLnF1b3Rlc0Ftb3VudDtcclxuICAgICAgICBjb250cm9sbGVyLnF1b3RlcyA9IFtdO1xyXG4gICAgICAgIGNvbnRyb2xsZXIucmFuZG9tUXVvdGUgPSAna2FrYSc7XHJcblxyXG4gICAgICAgIGNvbnRyb2xsZXIuYm9vay5hYnN0cmFjdEl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ3F1b3RlJykge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5xdW90ZXMucHVzaChpdGVtLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnRyb2xsZXIuY2hvb3NlUmFuZG9tUXVvdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbnRyb2xsZXIucXVvdGVzQW1vdW50KTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5yYW5kb21RdW90ZSA9IGNvbnRyb2xsZXIucXVvdGVzW3JhbmRvbUluZGV4XTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnRyb2xsZXIuY2hvb3NlUmFuZG9tUXVvdGUoKTtcclxuICAgICAgICBzZXRJbnRlcnZhbChjb250cm9sbGVyLmNob29zZVJhbmRvbVF1b3RlLCAxMDAwKTtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuY29udHJvbGxlcignU2VhcmNoQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRodHRwJywgJ0Jvb2tzJywgJ0Jvb2snLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgQm9va3MsIEJvb2spIHtcclxuXHQkc2NvcGUuc3VibWl0U2VhcmNoID0gZnVuY3Rpb24gKGZvcm0pIHtcclxuXHRcdGlmIChmb3JtLiR2YWxpZCkge1xyXG5cdFx0XHR2YXIgdXJsO1xyXG5cdFx0XHQkc2NvcGUudGVtcEJvb2tzID0gW107XHJcblx0XHRcdCRzY29wZS5pbmRpY2VzQWRkZWQgPSBbXTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICgkc2NvcGUuc2VhcmNoUGFyYW0uYnlUZXJtID09IFwiYWxsXCIpe1xyXG5cdFx0XHRcdHVybCA9IFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYm9va3MvdjEvdm9sdW1lcz9xPVwiKyRzY29wZS5zZWFyY2hQYXJhbS50ZXh0K1wiJm1heFJlc3VsdHM9MjBcIjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR1cmwgPSBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2Jvb2tzL3YxL3ZvbHVtZXM/cT1cIiskc2NvcGUuc2VhcmNoUGFyYW0uYnlUZXJtK1wiOlwiKyRzY29wZS5zZWFyY2hQYXJhbS50ZXh0K1wiJm1heFJlc3VsdHM9MjBcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHQkaHR0cC5nZXQodXJsKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGlmIChyZXNwb25zZS50b3RhbEl0ZW1zID4gMCl7XHJcblx0XHRcdFx0XHR2YXIgZWxtLCBvYmosIGFwcEJvb2tzID0gcmVzcG9uc2UuaXRlbXM7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBwcm9wZXJ0eSBpbiBhcHBCb29rcykge1xyXG5cdFx0XHRcdFx0XHRlbG0gPSBhcHBCb29rc1twcm9wZXJ0eV07XHJcblx0XHRcdFx0XHRcdG9iaiA9IHtcclxuXHRcdFx0XHRcdFx0XHRpZDogZWxtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdHRpdGxlOiBlbG0udm9sdW1lSW5mby50aXRsZSxcclxuXHRcdFx0XHRcdFx0XHRhdXRob3I6IGVsbS52b2x1bWVJbmZvLmF1dGhvcnN8fFwiXCIsXHJcblx0XHRcdFx0XHRcdFx0aW1hZ2U6IGVsbS52b2x1bWVJbmZvLmltYWdlTGlua3MgPyBlbG0udm9sdW1lSW5mby5pbWFnZUxpbmtzLnRodW1ibmFpbCA6IEJvb2tzLmRlZmF1bHRjb3ZlcixcclxuXHRcdFx0XHRcdFx0XHRwdWJsaXNoZXI6IGVsbS52b2x1bWVJbmZvLnB1Ymxpc2hlcixcclxuXHRcdFx0XHRcdFx0XHRwdWJsaWNhdGlvbkRhdGU6IGVsbS52b2x1bWVJbmZvLnB1Ymxpc2hlZERhdGUsXHJcblx0XHRcdFx0XHRcdFx0Y2F0ZWdvcnk6IGVsbS52b2x1bWVJbmZvLmNhdGVnb3JpZXMsXHJcblx0XHRcdFx0XHRcdFx0bGVuZ3RoOiBlbG0udm9sdW1lSW5mby5wYWdlQ291bnQsXHJcblx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGVsbS52b2x1bWVJbmZvLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdGlzQWRkZWQgOiBmYWxzZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChCb29rcy5nZXRCb29rQnlJRChlbG0uaWQpKXtcclxuXHRcdFx0XHRcdFx0XHRvYmouaXNBZGRlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRlbXBCb29rcy5wdXNoKG9iaik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkc2NvcGUuYWRkQm9vayA9IGZ1bmN0aW9uKGluZGV4LCBib29rKSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS50ZW1wQm9va3NbaW5kZXhdLmlzQWRkZWQgPSB0cnVlOyAgXHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0dmFyIG5ld0Jvb2sgPSBuZXcgQm9vayhib29rKTtcclxuXHRcdFx0XHRcdFx0bmV3Qm9vay5zYXZlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkc2NvcGUubm9SZXN1bHRzID0gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdCRzY29wZS5ub1Jlc3VsdHMgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuY29udHJvbGxlcignU3RhdGlzdGljc0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdCb29rcycsICdCb29rJywgZnVuY3Rpb24gKCRzY29wZSwgQm9va3MsIEJvb2spIHtcclxuXHR2YXIgYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpLFxyXG5cdFx0c3VtUXVvdGVzID0gMCxcclxuXHRcdHN1bU5vdGVzID0gMCxcclxuXHRcdHN1bVJldmlldyA9IDAsXHJcblx0XHRzdW1Cb29rc1F1b3RlcyA9IDAsXHJcblx0XHRzdW1Cb29rc05vdGVzID0gMCxcclxuXHRcdGFtb3VudFBhZ2VzID0gMCxcclxuXHRcdGF2YXJhZ2VRdW90ZXMsXHJcblx0XHRhdmFyYWdlTm90ZXM7XHJcblx0XHJcblxyXG5cdGFuZ3VsYXIuZm9yRWFjaChib29rcywgZnVuY3Rpb24gKG9iaikge1xyXG5cdFx0aWYgKG9iai5xdW90ZXNBbW91bnQpIHtcclxuXHRcdFx0c3VtQm9va3NRdW90ZXMrKztcclxuXHRcdFx0c3VtUXVvdGVzICs9IG9iai5xdW90ZXNBbW91bnQ7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmIChvYmoubm90ZXNBbW91bnQpIHtcclxuXHRcdFx0c3VtQm9va3NOb3RlcysrO1xyXG5cdFx0XHRzdW1Ob3RlcyArPSBvYmoubm90ZXNBbW91bnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG9iai5yZXZpZXcpe1xyXG5cdFx0XHRzdW1SZXZpZXcrKztcclxuXHRcdH1cclxuXHJcblx0XHRpZihvYmoubGVuZ3RoKXtcclxuXHRcdFx0YW1vdW50UGFnZXMgKz0gb2JqLmxlbmd0aDtcclxuXHRcdH1cdFx0XHJcblx0fSk7XHJcblxyXG5cdGF2YXJhZ2VRdW90ZXMgPSBwYXJzZUludCggc3VtUXVvdGVzIC8gYm9va3MubGVuZ3RoKTtcclxuXHRhdmFyYWdlTm90ZXMgPSBwYXJzZUludCggc3VtTm90ZXMgLyBib29rcy5sZW5ndGgpO1xyXG5cclxuXHQkc2NvcGUuc3RhdGlzdGljcyA9IHtcclxuXHRcdGFtb3VudEJvb2tzOiBib29rcy5sZW5ndGgsXHJcblx0XHRhdmFyYWdlTm90ZXM6IGF2YXJhZ2VOb3RlcyxcclxuXHRcdHN1bUJvb2tzTm90ZXM6IHN1bUJvb2tzTm90ZXMsXHJcblx0XHRhdmFyYWdlUXVvdGVzOiBhdmFyYWdlUXVvdGVzLFx0XHRcclxuXHRcdHN1bUJvb2tzUXVvdGVzOiBzdW1Cb29rc1F1b3RlcyxcclxuXHRcdHF1b3Rlc0Ftb3VudEFsbDogc3VtUXVvdGVzLFxyXG5cdFx0bm90ZXNBbW91bnRBbGw6IHN1bU5vdGVzLFxyXG5cdFx0cmV2aWV3QW1vdW50QWxsOiBzdW1SZXZpZXdcdFxyXG5cdH07XHJcblx0JHNjb3BlLmJvb2tzID0gYm9va3M7XHJcblxyXG5cdCRzY29wZS5nZXRSYW5kb20gPSBmdW5jdGlvbihtaW4sbWF4KXtcclxuXHQgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG5cdH1cclxuXHJcblx0JHNjb3BlLmJvb2tzSGVpZ2h0ID0gcGFyc2VJbnQoYW1vdW50UGFnZXMgKiAwLjMgLyAxMCk7XHJcblxyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ2FkZENhbmNlbEJ0bicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL2FkZC1jYW5jZWwtYnRuLmh0bWwnXHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdhZGRlZE1vZGlmaWVkJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL2FkZGVkLW1vZGlmaWVkLXNlY3Rpb24uaHRtbCcsXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdib29rU2VhcmNoU2VjdGlvbicsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9ib29rLXNlYXJjaC1zZWN0aW9uLmh0bWwnLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnZGV0YWlsc0ZsYWdzJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL2RldGFpbHMtZmxhZ3MuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkcm91dGVQYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mb1VybDogJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvaW5mbycsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFVybDogJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvY29udGVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYWJzdHJhY3RVcmw6ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2Fic3RyYWN0J1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnZmxhZ3NDdHJsJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnZWRpdERlbGV0ZUJ0bicsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9lZGl0LWRlbGV0ZS1idG4uaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkcm91dGVQYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdFBhZ2VVcmw6ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2VkaXQnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdlZGl0RGVsQ3RybCdcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ2ZpbHRlckFic3RyYWN0JywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL2ZpbHRlci1hYnN0ci5odG1sJyxcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ21haW5OYXYnLCBbICckbG9jYXRpb24nLCBmdW5jdGlvbigkbG9jYXRpb24pe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvbWFpbi1uYXYuaHRtbCcsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7fSxcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5pc0FjdGl2ZUNsYXNzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmlzQWN0aXZlQ2xhc3MgPSAhc2NvcGUuaXNBY3RpdmVDbGFzcztcclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICBzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uICh2aWV3TG9jYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZpZXdMb2NhdGlvbiA9PT0gJGxvY2F0aW9uLnBhdGgoKTtcclxuICAgICAgICAgICAgICAgIH07ICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ29wZW5Bc2lkZUJ0bicsIFsnJHJvb3RTY29wZScsIGZ1bmN0aW9uKHJvb3RTY29wZSl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9vcGVuLWFzaWRlLWJ0bi5odG1sJyxcclxuICAgICAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmlzQWN0aXZlQ2xhc3MgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHJvb3RTY29wZS5pc0FjdGl2ZUNsYXNzQ29udGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUub3BlbkFzaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICBzY29wZS5pc0FjdGl2ZUNsYXNzID0gIXNjb3BlLmlzQWN0aXZlQ2xhc3M7XHJcbiAgICAgICAgICAgICAgICAgICByb290U2NvcGUuaXNBY3RpdmVDbGFzc0NvbnRlbnQgPSAhcm9vdFNjb3BlLmlzQWN0aXZlQ2xhc3NDb250ZW50XHJcbiAgICAgICAgICAgICAgICB9ICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1dKTtcclxuXHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ3F1aWNrU3RhdGlzdGljcycsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9xdWljay1zdGF0aXN0aWNzLmh0bWwnLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgncmFuZG9tUXVvdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9yYW5kb20tcXVvdGUuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdyYW5kb21RdW90ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdxdW90ZUN0cmwnXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ3NhdmVDYW5jZWxCdG4nLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvc2F2ZS1jYW5jZWwtYnRuLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHJvdXRlUGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tVcmw6ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2luZm8nXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdzYXZlQ2FuY2VsQ3RybCdcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ3N0YXRpc3RpY3NTZWN0aW9uJywgWydCb29rcycsIGZ1bmN0aW9uIChCb29rcykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvc3RhdGlzdGljcy1zZWN0aW9uLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvb2tzID0gQm9va3MuZ2V0QWxsQm9va3MoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnc3RhdFNlY0N0cmwnXHJcbiAgICAgICAgfTtcclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmZpbHRlcignYWJzdHJhY3RGaWx0ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtcywgdHlwZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gW107XHJcblxyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaXRlbXMsIGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZXNUb1Nob3cucXVvdGVzICYmIHR5cGVzVG9TaG93Lm5vdGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXR5cGVzVG9TaG93LnF1b3RlcyAmJiB0eXBlc1RvU2hvdy5ub3RlcyAmJiBpdGVtLnR5cGUgPT09ICdub3RlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVzVG9TaG93LnF1b3RlcyAmJiAhdHlwZXNUb1Nob3cubm90ZXMgJiYgaXRlbS50eXBlID09PSAncXVvdGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQ7XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpLmZhY3RvcnkoJ0Jvb2snLCBmdW5jdGlvbiBCb29rRmFjdG9yeSgpIHtcclxuXHJcbiAgICB2YXIgQm9va0ZhY3RvcnkgPSBmdW5jdGlvbiAob2JqKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBvYmouaWQ7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IG9iai50aXRsZSB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZiAob2JqLmF1dGhvcikge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KG9iai5hdXRob3IpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhvciA9IG9iai5hdXRob3Iuam9pbignLCAnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aG9yID0gb2JqLmF1dGhvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aG9yID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBvYmouaW1hZ2UgfHwgbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKG9iai5jYXRlZ29yeSkge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KG9iai5jYXRlZ29yeSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBvYmouY2F0ZWdvcnkuam9pbignLCAnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBvYmouY2F0ZWdvcnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNhdGVnb3J5ID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucHVibGlzaGVyID0gb2JqLnB1Ymxpc2hlciB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMucHVibGljYXRpb25EYXRlID0gb2JqLnB1YmxpY2F0aW9uRGF0ZSB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gb2JqLmxlbmd0aCB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMucmF0ZSA9IG9iai5yYXRlIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IG9iai5kZXNjcmlwdGlvbiB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMucmV2aWV3ID0gb2JqLnJldmlldyB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuYWJzdHJhY3RJdGVtcyA9IG9iai5hYnN0cmFjdEl0ZW1zIHx8IFtdO1xyXG4gICAgICAgIHRoaXMucXVvdGVzQW1vdW50ID0gb2JqLnF1b3Rlc0Ftb3VudCB8fCAwO1xyXG4gICAgICAgIHRoaXMubm90ZXNBbW91bnQgPSBvYmoubm90ZXNBbW91bnQgfHwgMDtcclxuXHJcbiAgICAgICAgaWYgKCFvYmouYWRkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRlZCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm1vZGlmaWVkID0gb2JqLm1vZGlmaWVkIHx8IG5ldyBEYXRlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBjdXJyZW50Qm9va3MgPSBbXTtcclxuXHJcbiAgICBCb29rRmFjdG9yeS5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpIHtcclxuICAgICAgICAgICAgY3VycmVudEJvb2tzID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRCb29rcy5wdXNoKHRoaXMpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdib29rcycsIGFuZ3VsYXIudG9Kc29uKGN1cnJlbnRCb29rcykpO1xyXG4gICAgfTtcclxuXHJcbiAgICBCb29rRmFjdG9yeS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgICAgaXNOZXcgPSB0cnVlO1xyXG4gICAgICAgIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpIHtcclxuICAgICAgICAgICAgdGhhdC5zYXZlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3VycmVudEJvb2tzID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChjdXJyZW50Qm9va3MsIGZ1bmN0aW9uIChvYmosIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLmlkID09IHRoYXQuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godGhhdCwgZnVuY3Rpb24gKHZhbHVlLCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcGVydHldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jvb2tzJywgYW5ndWxhci50b0pzb24oY3VycmVudEJvb2tzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNOZXcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChpc05ldykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5zYXZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIEJvb2tGYWN0b3J5LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2RlbGV0ZScpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gQm9va0ZhY3Rvcnk7XHJcbn0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpLmZhY3RvcnkoJ0Jvb2tzJywgZnVuY3Rpb24gQm9va3NGYWN0b3J5KCRodHRwLCBCb29rKSB7XHJcbiAgICB2YXIgZmFjdG9yeSA9IHt9O1xyXG4gICAgZmFjdG9yeS5kZWZhdWx0Y292ZXIgPSBcImltYWdlcy9UaGVfQm9va18oRnJvbnRfQ292ZXIpLmpwZ1wiO1xyXG4gICAgZmFjdG9yeS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByYXdCb29rc0FycmF5ID0gJGh0dHAuZ2V0KFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYm9va3MvdjEvdXNlcnMvMTE0ODczMjI5MjQwMzM2MzUwMTM0L2Jvb2tzaGVsdmVzLzAvdm9sdW1lc1wiKTtcclxuICAgICAgICByYXdCb29rc0FycmF5LnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHZhciBib29rLCBlbG0sIG9iaiwgYXBwQm9va3MgPSByZXNwb25zZS5pdGVtcztcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYXBwQm9va3MpIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGFwcEJvb2tzW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgIG9iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogZWxtLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBlbG0udm9sdW1lSW5mby50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICBhdXRob3I6IGVsbS52b2x1bWVJbmZvLmF1dGhvcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgcHVibGlzaGVyOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgcHVibGljYXRpb25EYXRlOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZWREYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlOiBlbG0udm9sdW1lSW5mby5pbWFnZUxpbmtzLnRodW1ibmFpbCxcclxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogZWxtLnZvbHVtZUluZm8uY2F0ZWdvcmllcyxcclxuICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IGVsbS52b2x1bWVJbmZvLnBhZ2VDb3VudCxcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZWxtLnZvbHVtZUluZm8uZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJvb2sgPSBuZXcgQm9vayhvYmopO1xyXG4gICAgICAgICAgICAgICAgYm9vay51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpIHtcclxuXHRcdFx0ZmFjdG9yeS5pbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkoKTtcclxuXHJcblxyXG4gICAgZmFjdG9yeS5nZXRBbGxCb29rcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICB9O1xyXG4gICAgZmFjdG9yeS5nZXRCb29rQnlJRCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIHZhciBib29rcyA9IGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9va3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGJvb2tzW2ldLmlkID09PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJvb2tzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZmFjdG9yeTtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NjcmlwdHMifQ==