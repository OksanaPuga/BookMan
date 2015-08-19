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
        .when('/about', {
            templateUrl: 'templates/pages/about/index.html'
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
	$scope.books = Books.getAllBooks();
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
						$scope.books = Books.getAllBooks();
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

 	function getRandom(min,max){
	 	return Math.floor(Math.random() * (max - min + 1)) + min;
	}

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
		obj.style = {
			width : getRandom(80, 90),
		 	left: getRandom(-5, 10),
		 	height: getRandom(20, 50),
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

	$scope.booksHeight = parseInt(amountPages * 0.09 / 10);

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

angular.module('bookman')
    .directive('filterAbstract', function () {

        return {
            restrict: 'E',
            templateUrl: 'templates/directives/filter-abstr.html',
        }

    });

angular.module('bookman')
    .directive('mainNav', [ '$location','$rootScope', function($location, $rootscope){
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/main-nav.html',
            link: function(scope, element, attrs) {
                $rootscope.isActiveAside = false;
                scope.openAside = function() {
                    $rootscope.isActiveAside = !$rootscope.isActiveAside;
                } 
                scope.isActive = function (viewLocation) {
                     return viewLocation === $location.path();
                };          
            }
        }
    }]);
angular.module('bookman')
    .directive('modalBackdrop', [ '$location','$rootScope', function($location, $rootscope){
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/modal-backdrop.html',
            link: function(scope, element, attrs) {               
                $rootscope.isActiveAside = false;
                scope.closeAside = function() {
                    $rootscope.isActiveAside = true;
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
        var that = this,
            currentBooks = angular.fromJson(localStorage.getItem('books'));
            angular.forEach(currentBooks, function (obj, index) {
                if (obj.id == that.id) {
                    currentBooks.splice(index, 1); 
                    localStorage.setItem('books', angular.toJson(currentBooks));
                }
            });
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

    //window.localStorage.clear();

    console.log(localStorage.getItem('books'));

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWJzdHJhY3QtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWRkLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rLWNvbnRlbnQtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stZWRpdC1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYm9vay1pbmZvLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rcy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcmFuZG9tLXF1b3Rlcy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvc2VhcmNoLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9zdGF0aXN0aWNzLWNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL2FkZC1jYW5jZWwtYnRuLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvYWRkZWQtbW9kaWZpZWQtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9ib29rLXNlYXJjaC1zZWN0aW9uLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvZGV0YWlscy1mbGFncy1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL2VkaXQtZGVsZXRlLWJ0bi1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL2ZpbHRlci1hYnN0cmFjdC1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL21haW4tbmF2LWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvbW9kYWwtYmFja2Ryb3AtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9xdWljay1zdGF0aXN0aWNzLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvcmFuZG9tLXF1b3RlLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvc2F2ZS1jYW5jZWwtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9zdGF0aXN0aWNzLXNlY3Rpb24tZGlyZWN0aXZlLmpzIiwiZmlsdGVycy9hYnN0cmFjdC1maWx0ZXIuanMiLCJzZXJ2aWNlcy9ib29rLWZhY3RvcnkuanMiLCJzZXJ2aWNlcy9ib29rcy1mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJywgWyduZ1JvdXRlJ10pLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgICAgICByZWRpcmVjdFRvOiAnL2Jvb2tzJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rc0N0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL3NlYXJjaCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvc2VhcmNoL2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU2VhcmNoQ29udHJvbGxlcidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvc3RhdGlzdGljcycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvc3RhdGlzdGljcy9pbmRleC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1N0YXRpc3RpY3NDb250cm9sbGVyJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9hYm91dCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYWJvdXQvaW5kZXguaHRtbCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYWRkJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQWRkQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tBZGRDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvaW5mbycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZGV0YWlscy9pbmZvLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va0luZm9Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va0luZm9DdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvYWJzdHJhY3QnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2RldGFpbHMvYWJzdHJhY3QuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQWJzdHJhY3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va0Fic3RyQ3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MvOmlkL2NvbnRlbnQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2RldGFpbHMvY29udGVudC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tDb250ZW50Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tDb250Q3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MvOmlkL2VkaXQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2VkaXQuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rRWRpdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rRWRpdEN0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAub3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9ib29rcydcclxuICAgICAgICB9KVxyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rQWJzdHJhY3RDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0Jvb2snLCAnQm9va3MnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2ssIEJvb2tzKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuICAgICAgICAkc2NvcGUuY3VycmVudFRhYiA9ICdhYnN0cic7XHJcblxyXG4gICAgICAgICRzY29wZS50eXBlc1RvU2hvdyA9IHtcclxuICAgICAgICAgICAgcXVvdGVzOiB0cnVlLFxyXG4gICAgICAgICAgICBub3RlczogdHJ1ZSxcclxuICAgICAgICAgICAgcmV2aWV3OiB0cnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQgPSB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdxdW90ZScsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6ICcnLFxyXG4gICAgICAgICAgICBpbmRleDogbnVsbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5pc0N1cnJlbnQgPSBmdW5jdGlvbiAodGFiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuY3VycmVudFRhYiA9PT0gdGFiO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUuaW5jcmVhc2VOb3Rlc0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2subm90ZXNBbW91bnQrKztcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS5pbmNyZWFzZVF1b3Rlc0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2sucXVvdGVzQW1vdW50Kys7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc2NvcGUuZGVjcmVhc2VOb3Rlc0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2subm90ZXNBbW91bnQtLTtcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS5kZWNyZWFzZVF1b3Rlc0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2sucXVvdGVzQW1vdW50LS07XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgJHNjb3BlLnNob3dBbGxBYnN0cmFjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnR5cGVzVG9TaG93ID0ge1xyXG4gICAgICAgICAgICAgICAgcXVvdGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbm90ZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZXZpZXc6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS50b2dnbGVCdXR0b25zID0gZnVuY3Rpb24gKCRldmVudCkge1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJGV2ZW50LmN1cnJlbnRUYXJnZXQ7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoISQodGFyZ2V0KS5oYXNDbGFzcygnb3BlbmVkJykpIHtcclxuICAgICAgICAgICAgICAgICQoJ2FydGljbGUnKS5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJCh0YXJnZXQpLnRvZ2dsZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgJHNjb3BlLnVwZGF0ZUJvb2tBYnN0ciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2subW9kaWZpZWQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudGJvb2sgPSBuZXcgQm9vaygkc2NvcGUuYm9vayk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRib29rLnVwZGF0ZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5hZGRBYnN0ckl0ZW0gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWRpdGVkSXRlbSA9ICRzY29wZS5hYnN0ckl0ZW1Ub0FkZCxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRJdGVtID0gJHNjb3BlLmJvb2suYWJzdHJhY3RJdGVtc1skc2NvcGUuYWJzdHJJdGVtVG9BZGQuaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVkaXRlZEl0ZW0uY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVkaXRlZEl0ZW0uaW5kZXggPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWRpdGVkSXRlbS50eXBlID09PSAncmV2aWV3Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYm9vay5yZXZpZXcgPSBlZGl0ZWRJdGVtLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJvb2suYWJzdHJhY3RJdGVtcy5wdXNoKGVkaXRlZEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWRpdGVkSXRlbS50eXBlID09PSAncXVvdGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5jcmVhc2VRdW90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmNyZWFzZU5vdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SXRlbS50eXBlID09PSAnbm90ZScgJiYgZWRpdGVkSXRlbS50eXBlID09PSAncXVvdGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kZWNyZWFzZU5vdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmNyZWFzZVF1b3Rlc0Ftb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEl0ZW0udHlwZSA9PT0gJ3F1b3RlJyAmJiBlZGl0ZWRJdGVtLnR5cGUgPT09ICdub3RlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGVjcmVhc2VRdW90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmluY3JlYXNlTm90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVkaXRlZEl0ZW0udHlwZSA9PT0gJ3JldmlldycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJvb2sucmV2aWV3ID0gZWRpdGVkSXRlbS5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGVsZXRlQWJzdHJJdGVtKGVkaXRlZEl0ZW0uaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncXVvdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJdGVtLmNvbnRlbnQgPSBlZGl0ZWRJdGVtLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEl0ZW0udHlwZSA9IGVkaXRlZEl0ZW0udHlwZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZCA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncXVvdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBudWxsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVCb29rQWJzdHIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5lZGl0QWJzdHJJdGVtID0gZnVuY3Rpb24gKCRpbmRleCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQudHlwZSA9ICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXNbJGluZGV4XS50eXBlO1xyXG4gICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQuY29udGVudCA9ICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXNbJGluZGV4XS5jb250ZW50O1xyXG4gICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQuaW5kZXggPSAkaW5kZXg7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKTtcclxuICAgICAgICAgICAgJCgndGV4dGFyZWEnKS5mb2N1cygpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUJvb2tBYnN0cigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5kZWxldGVBYnN0ckl0ZW0gPSBmdW5jdGlvbiAoJGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zWyRpbmRleF0udHlwZSA9PT0gJ3F1b3RlJykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmRlY3JlYXNlUXVvdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJHNjb3BlLmJvb2suYWJzdHJhY3RJdGVtc1skaW5kZXhdLnR5cGUgPT09ICdub3RlJykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmRlY3JlYXNlTm90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zLnNwbGljZShbJGluZGV4XSwgMSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlQm9va0Fic3RyKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmVkaXRSZXZpZXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZC50eXBlID0gJ3Jldmlldyc7XHJcbiAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZC5jb250ZW50ID0gJHNjb3BlLmJvb2sucmV2aWV3O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsMCk7XHJcbiAgICAgICAgICAgICQoJ3RleHRhcmVhJykuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVCb29rQWJzdHIoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuZGVsZXRlUmV2aWV3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5yZXZpZXcgPSBudWxsO1xyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlQm9va0Fic3RyKCk7XHJcbiAgICAgICAgfTtcclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va0FkZENvbnRyb2xsZXInLCBbJyRzY29wZScsICdCb29rJywgJ0Jvb2tzJywgZnVuY3Rpb24gKCRzY29wZSwgQm9vaywgQm9va3MpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmdlbmVyYXRlSWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByYW5kb21JZCA9ICcnO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJhbmRvbUlkICs9IE1hdGguY2VpbChNYXRoLnJhbmRvbSgpICogOSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbUlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2sgPSB7fTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmFkZEJvb2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUuYm9vay5yYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYm9vay5yYXRlID0gWycxIHN0YXInLCAnMiBzdGFycycsICczIHN0YXJzJywgJzQgc3RhcnMnLCAnNSBzdGFycyddLnNsaWNlKDAsICRzY29wZS5ib29rLnJhdGUpO1xyXG4gICAgICAgICAgICAgICAgLy8gZm9yIGl0ZXJhdGluZyByYXRlLXN0YXJzXHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgbG9va3MgcHJldHR5IHN0cmFuZ2UsIGJ1dCBpdCBpcyB0aGUgZWFzaWVzdCBoZWxwZXIgZm9yIG5nLXJlcGVhdCB3aGljaCBJJ3ZlIGRpc2NvdmVyZWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5pZCA9ICRzY29wZS5nZW5lcmF0ZUlkKCk7XHJcbiAgICAgICAgICAgIG5ldyBCb29rKCRzY29wZS5ib29rKS5zYXZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tDb250ZW50Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdCb29rJywgJ0Jvb2tzJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBCb29rLCBCb29rcykge1xyXG5cclxuICAgICAgICAkc2NvcGUuYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRUYWIgPSAnY29udCc7XHJcblxyXG4gICAgICAgICRzY29wZS5pc0N1cnJlbnQgPSBmdW5jdGlvbiAodGFiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuY3VycmVudFRhYiA9PT0gdGFiO1xyXG4gICAgICAgIH1cclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va0VkaXRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0Jvb2snLCAnQm9va3MnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2ssIEJvb2tzKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmVkaXRlZEJvb2tJbmZvID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgcGFyYW0gaW4gJHNjb3BlLmJvb2spIHtcclxuICAgICAgICAgICAgJHNjb3BlLmVkaXRlZEJvb2tJbmZvW3BhcmFtXSA9ICRzY29wZS5ib29rW3BhcmFtXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnJhdGUpKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lZGl0ZWRCb29rSW5mby5yYXRlID0gJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnJhdGUubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLnNhdmVDaGFuZ2VzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCRzY29wZS5lZGl0ZWRCb29rSW5mby5yYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSA9IFsnMSBzdGFyJywgJzIgc3RhcnMnLCAnMyBzdGFycycsICc0IHN0YXJzJywgJzUgc3RhcnMnXS5zbGljZSgwLCAkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBmb3IgaXRlcmF0aW5nIHJhdGUtc3RhcnNcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBsb29rcyBwcmV0dHkgc3RyYW5nZSwgYnV0IGl0IGlzIHRoZSBlYXNpZXN0IGhlbHBlciBmb3IgbmctcmVwZWF0IHdoaWNoIEkndmUgZGlzY292ZXJlZFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBwYXJhbSBpbiAkc2NvcGUuZWRpdGVkQm9va0luZm8pIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5ib29rW3BhcmFtXSA9ICRzY29wZS5lZGl0ZWRCb29rSW5mb1twYXJhbV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLm1vZGlmaWVkID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgbmV3IEJvb2soJHNjb3BlLmJvb2spLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rSW5mb0NvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQm9vaycsICdCb29rcycsIGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9vaywgQm9va3MpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG4gICAgICAgICRzY29wZS5jdXJyZW50VGFiID0gJ2luZm8nO1xyXG5cclxuICAgICAgICAkc2NvcGUuaXNDdXJyZW50ID0gZnVuY3Rpb24gKHRhYikge1xyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLmN1cnJlbnRUYWIgPT09IHRhYjtcclxuICAgICAgICB9XHJcblxyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rc0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdCb29rcycsICdCb29rJywgZnVuY3Rpb24gKCRzY29wZSwgQm9va3MsIEJvb2spIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2tzID0gQm9va3MuZ2V0QWxsQm9va3MoKTtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdyYW5kb21RdW90ZUNvbnRyb2xsZXInLCBbJ0Jvb2tzJywgJyRyb3V0ZVBhcmFtcycsIGZ1bmN0aW9uIChCb29rcywgJHJvdXRlUGFyYW1zKSB7XHJcbiAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSB0aGlzO1xyXG4gICAgICAgIGNvbnRyb2xsZXIuYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgY29udHJvbGxlci5xdW90ZXNBbW91bnQgPSBjb250cm9sbGVyLmJvb2sucXVvdGVzQW1vdW50O1xyXG4gICAgICAgIGNvbnRyb2xsZXIucXVvdGVzID0gW107XHJcbiAgICAgICAgY29udHJvbGxlci5yYW5kb21RdW90ZSA9ICdrYWthJztcclxuXHJcbiAgICAgICAgY29udHJvbGxlci5ib29rLmFic3RyYWN0SXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSAncXVvdGUnKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLnF1b3Rlcy5wdXNoKGl0ZW0uY29udGVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29udHJvbGxlci5jaG9vc2VSYW5kb21RdW90ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29udHJvbGxlci5xdW90ZXNBbW91bnQpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLnJhbmRvbVF1b3RlID0gY29udHJvbGxlci5xdW90ZXNbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29udHJvbGxlci5jaG9vc2VSYW5kb21RdW90ZSgpO1xyXG4gICAgICAgIHNldEludGVydmFsKGNvbnRyb2xsZXIuY2hvb3NlUmFuZG9tUXVvdGUsIDEwMDApO1xyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5jb250cm9sbGVyKCdTZWFyY2hDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGh0dHAnLCAnQm9va3MnLCAnQm9vaycsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCBCb29rcywgQm9vaykge1xyXG5cdCRzY29wZS5ib29rcyA9IEJvb2tzLmdldEFsbEJvb2tzKCk7XHJcblx0JHNjb3BlLnN1Ym1pdFNlYXJjaCA9IGZ1bmN0aW9uIChmb3JtKSB7XHJcblx0XHRpZiAoZm9ybS4kdmFsaWQpIHtcclxuXHRcdFx0dmFyIHVybDtcclxuXHRcdFx0JHNjb3BlLnRlbXBCb29rcyA9IFtdO1xyXG5cdFx0XHQkc2NvcGUuaW5kaWNlc0FkZGVkID0gW107XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoJHNjb3BlLnNlYXJjaFBhcmFtLmJ5VGVybSA9PSBcImFsbFwiKXtcclxuXHRcdFx0XHR1cmwgPSBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2Jvb2tzL3YxL3ZvbHVtZXM/cT1cIiskc2NvcGUuc2VhcmNoUGFyYW0udGV4dCtcIiZtYXhSZXN1bHRzPTIwXCI7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dXJsID0gXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9ib29rcy92MS92b2x1bWVzP3E9XCIrJHNjb3BlLnNlYXJjaFBhcmFtLmJ5VGVybStcIjpcIiskc2NvcGUuc2VhcmNoUGFyYW0udGV4dCtcIiZtYXhSZXN1bHRzPTIwXCI7XHJcblx0XHRcdH1cclxuXHRcdFx0JGh0dHAuZ2V0KHVybCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2UudG90YWxJdGVtcyA+IDApe1xyXG5cdFx0XHRcdFx0dmFyIGVsbSwgb2JqLCBhcHBCb29rcyA9IHJlc3BvbnNlLml0ZW1zO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgcHJvcGVydHkgaW4gYXBwQm9va3MpIHtcclxuXHRcdFx0XHRcdFx0ZWxtID0gYXBwQm9va3NbcHJvcGVydHldO1xyXG5cdFx0XHRcdFx0XHRvYmogPSB7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IGVsbS5pZCxcclxuXHRcdFx0XHRcdFx0XHR0aXRsZTogZWxtLnZvbHVtZUluZm8udGl0bGUsXHJcblx0XHRcdFx0XHRcdFx0YXV0aG9yOiBlbG0udm9sdW1lSW5mby5hdXRob3JzfHxcIlwiLFxyXG5cdFx0XHRcdFx0XHRcdGltYWdlOiBlbG0udm9sdW1lSW5mby5pbWFnZUxpbmtzID8gZWxtLnZvbHVtZUluZm8uaW1hZ2VMaW5rcy50aHVtYm5haWwgOiBCb29rcy5kZWZhdWx0Y292ZXIsXHJcblx0XHRcdFx0XHRcdFx0cHVibGlzaGVyOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZXIsXHJcblx0XHRcdFx0XHRcdFx0cHVibGljYXRpb25EYXRlOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZWREYXRlLFxyXG5cdFx0XHRcdFx0XHRcdGNhdGVnb3J5OiBlbG0udm9sdW1lSW5mby5jYXRlZ29yaWVzLFxyXG5cdFx0XHRcdFx0XHRcdGxlbmd0aDogZWxtLnZvbHVtZUluZm8ucGFnZUNvdW50LFxyXG5cdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBlbG0udm9sdW1lSW5mby5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRpc0FkZGVkIDogZmFsc2VcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoQm9va3MuZ2V0Qm9va0J5SUQoZWxtLmlkKSl7XHJcblx0XHRcdFx0XHRcdFx0b2JqLmlzQWRkZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCRzY29wZS50ZW1wQm9va3MucHVzaChvYmopO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0JHNjb3BlLmFkZEJvb2sgPSBmdW5jdGlvbihpbmRleCwgYm9vaykge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudGVtcEJvb2tzW2luZGV4XS5pc0FkZGVkID0gdHJ1ZTsgIFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHZhciBuZXdCb29rID0gbmV3IEJvb2soYm9vayk7XHJcblx0XHRcdFx0XHRcdG5ld0Jvb2suc2F2ZSgpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0JHNjb3BlLm5vUmVzdWx0cyA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQkc2NvcGUubm9SZXN1bHRzID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpLmNvbnRyb2xsZXIoJ1N0YXRpc3RpY3NDb250cm9sbGVyJywgWyckc2NvcGUnLCAnQm9va3MnLCAnQm9vaycsIGZ1bmN0aW9uICgkc2NvcGUsIEJvb2tzLCBCb29rKSB7XHJcblx0dmFyIGJvb2tzID0gQm9va3MuZ2V0QWxsQm9va3MoKSxcclxuXHRcdHN1bVF1b3RlcyA9IDAsXHJcblx0XHRzdW1Ob3RlcyA9IDAsXHJcblx0XHRzdW1SZXZpZXcgPSAwLFxyXG5cdFx0c3VtQm9va3NRdW90ZXMgPSAwLFxyXG5cdFx0c3VtQm9va3NOb3RlcyA9IDAsXHJcblx0XHRhbW91bnRQYWdlcyA9IDAsXHJcblx0XHRhdmFyYWdlUXVvdGVzLFxyXG5cdFx0YXZhcmFnZU5vdGVzO1xyXG5cclxuIFx0ZnVuY3Rpb24gZ2V0UmFuZG9tKG1pbixtYXgpe1xyXG5cdCBcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG5cdH1cclxuXHJcblx0YW5ndWxhci5mb3JFYWNoKGJvb2tzLCBmdW5jdGlvbiAob2JqKSB7XHJcblx0XHRpZiAob2JqLnF1b3Rlc0Ftb3VudCkge1xyXG5cdFx0XHRzdW1Cb29rc1F1b3RlcysrO1xyXG5cdFx0XHRzdW1RdW90ZXMgKz0gb2JqLnF1b3Rlc0Ftb3VudDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKG9iai5ub3Rlc0Ftb3VudCkge1xyXG5cdFx0XHRzdW1Cb29rc05vdGVzKys7XHJcblx0XHRcdHN1bU5vdGVzICs9IG9iai5ub3Rlc0Ftb3VudDtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAob2JqLnJldmlldyl7XHJcblx0XHRcdHN1bVJldmlldysrO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKG9iai5sZW5ndGgpe1xyXG5cdFx0XHRhbW91bnRQYWdlcyArPSBvYmoubGVuZ3RoO1xyXG5cdFx0fVx0XHJcblx0XHRvYmouc3R5bGUgPSB7XHJcblx0XHRcdHdpZHRoIDogZ2V0UmFuZG9tKDgwLCA5MCksXHJcblx0XHQgXHRsZWZ0OiBnZXRSYW5kb20oLTUsIDEwKSxcclxuXHRcdCBcdGhlaWdodDogZ2V0UmFuZG9tKDIwLCA1MCksXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdGF2YXJhZ2VRdW90ZXMgPSBwYXJzZUludCggc3VtUXVvdGVzIC8gYm9va3MubGVuZ3RoKTtcclxuXHRhdmFyYWdlTm90ZXMgPSBwYXJzZUludCggc3VtTm90ZXMgLyBib29rcy5sZW5ndGgpO1xyXG5cclxuXHQkc2NvcGUuc3RhdGlzdGljcyA9IHtcclxuXHRcdGFtb3VudEJvb2tzOiBib29rcy5sZW5ndGgsXHJcblx0XHRhdmFyYWdlTm90ZXM6IGF2YXJhZ2VOb3RlcyxcclxuXHRcdHN1bUJvb2tzTm90ZXM6IHN1bUJvb2tzTm90ZXMsXHJcblx0XHRhdmFyYWdlUXVvdGVzOiBhdmFyYWdlUXVvdGVzLFx0XHRcclxuXHRcdHN1bUJvb2tzUXVvdGVzOiBzdW1Cb29rc1F1b3RlcyxcclxuXHRcdHF1b3Rlc0Ftb3VudEFsbDogc3VtUXVvdGVzLFxyXG5cdFx0bm90ZXNBbW91bnRBbGw6IHN1bU5vdGVzLFxyXG5cdFx0cmV2aWV3QW1vdW50QWxsOiBzdW1SZXZpZXdcdFxyXG5cdH07XHJcblx0JHNjb3BlLmJvb2tzID0gYm9va3M7XHJcblxyXG5cdCRzY29wZS5ib29rc0hlaWdodCA9IHBhcnNlSW50KGFtb3VudFBhZ2VzICogMC4wOSAvIDEwKTtcclxuXHJcbn1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnYWRkQ2FuY2VsQnRuJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvYWRkLWNhbmNlbC1idG4uaHRtbCdcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ2FkZGVkTW9kaWZpZWQnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvYWRkZWQtbW9kaWZpZWQtc2VjdGlvbi5odG1sJyxcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ2Jvb2tTZWFyY2hTZWN0aW9uJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL2Jvb2stc2VhcmNoLXNlY3Rpb24uaHRtbCcsXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdkZXRhaWxzRmxhZ3MnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvZGV0YWlscy1mbGFncy5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRyb3V0ZVBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvVXJsOiAnIy9ib29rcy8nICsgJHJvdXRlUGFyYW1zLmlkICsgJy9pbmZvJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VXJsOiAnIy9ib29rcy8nICsgJHJvdXRlUGFyYW1zLmlkICsgJy9jb250ZW50JyxcclxuICAgICAgICAgICAgICAgICAgICBhYnN0cmFjdFVybDogJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvYWJzdHJhY3QnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdmbGFnc0N0cmwnXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdlZGl0RGVsZXRlQnRuJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL2VkaXQtZGVsZXRlLWJ0bi5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBCb29rcywgQm9vaykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmRlbGV0ZUJvb2sgPSBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpOyBcclxuICAgICAgICAgICAgICAgICAgICAgYm9vayA9IG5ldyBCb29rKGJvb2spO1xyXG4gICAgICAgICAgICAgICAgICAgICBib29rLmRlbGV0ZSgpOyAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdFBhZ2VVcmw6ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2VkaXQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZVBhZ2VVcmw6ICcjL2Jvb2tzJ1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnZWRpdERlbEN0cmwnXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdmaWx0ZXJBYnN0cmFjdCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9maWx0ZXItYWJzdHIuaHRtbCcsXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdtYWluTmF2JywgWyAnJGxvY2F0aW9uJywnJHJvb3RTY29wZScsIGZ1bmN0aW9uKCRsb2NhdGlvbiwgJHJvb3RzY29wZSl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9tYWluLW5hdi5odG1sJyxcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICAkcm9vdHNjb3BlLmlzQWN0aXZlQXNpZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLm9wZW5Bc2lkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRyb290c2NvcGUuaXNBY3RpdmVBc2lkZSA9ICEkcm9vdHNjb3BlLmlzQWN0aXZlQXNpZGU7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgc2NvcGUuaXNBY3RpdmUgPSBmdW5jdGlvbiAodmlld0xvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2aWV3TG9jYXRpb24gPT09ICRsb2NhdGlvbi5wYXRoKCk7XHJcbiAgICAgICAgICAgICAgICB9OyAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdtb2RhbEJhY2tkcm9wJywgWyAnJGxvY2F0aW9uJywnJHJvb3RTY29wZScsIGZ1bmN0aW9uKCRsb2NhdGlvbiwgJHJvb3RzY29wZSl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9tb2RhbC1iYWNrZHJvcC5odG1sJyxcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkcm9vdHNjb3BlLmlzQWN0aXZlQXNpZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmNsb3NlQXNpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkcm9vdHNjb3BlLmlzQWN0aXZlQXNpZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgncXVpY2tTdGF0aXN0aWNzJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL3F1aWNrLXN0YXRpc3RpY3MuaHRtbCcsXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdyYW5kb21RdW90ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL3JhbmRvbS1xdW90ZS5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ3JhbmRvbVF1b3RlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3F1b3RlQ3RybCdcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnc2F2ZUNhbmNlbEJ0bicsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9zYXZlLWNhbmNlbC1idG4uaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkcm91dGVQYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja1VybDogJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvaW5mbydcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3NhdmVDYW5jZWxDdHJsJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnc3RhdGlzdGljc1NlY3Rpb24nLCBbJ0Jvb2tzJywgZnVuY3Rpb24gKEJvb2tzKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9zdGF0aXN0aWNzLXNlY3Rpb24uaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdzdGF0U2VjQ3RybCdcclxuICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZmlsdGVyKCdhYnN0cmFjdEZpbHRlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGl0ZW1zLCB0eXBlc1RvU2hvdykge1xyXG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlc1RvU2hvdy5xdW90ZXMgJiYgdHlwZXNUb1Nob3cubm90ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdHlwZXNUb1Nob3cucXVvdGVzICYmIHR5cGVzVG9TaG93Lm5vdGVzICYmIGl0ZW0udHlwZSA9PT0gJ25vdGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZXNUb1Nob3cucXVvdGVzICYmICF0eXBlc1RvU2hvdy5ub3RlcyAmJiBpdGVtLnR5cGUgPT09ICdxdW90ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZDtcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuZmFjdG9yeSgnQm9vaycsIGZ1bmN0aW9uIEJvb2tGYWN0b3J5KCkge1xyXG5cclxuICAgIHZhciBCb29rRmFjdG9yeSA9IGZ1bmN0aW9uIChvYmopIHtcclxuXHJcbiAgICAgICAgdGhpcy5pZCA9IG9iai5pZDtcclxuICAgICAgICB0aGlzLnRpdGxlID0gb2JqLnRpdGxlIHx8IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChvYmouYXV0aG9yKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkob2JqLmF1dGhvcikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aG9yID0gb2JqLmF1dGhvci5qb2luKCcsICcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRob3IgPSBvYmouYXV0aG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hdXRob3IgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IG9iai5pbWFnZSB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZiAob2JqLmNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkob2JqLmNhdGVnb3J5KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeSA9IG9iai5jYXRlZ29yeS5qb2luKCcsICcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeSA9IG9iai5jYXRlZ29yeTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wdWJsaXNoZXIgPSBvYmoucHVibGlzaGVyIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5wdWJsaWNhdGlvbkRhdGUgPSBvYmoucHVibGljYXRpb25EYXRlIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBvYmoubGVuZ3RoIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5yYXRlID0gb2JqLnJhdGUgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gb2JqLmRlc2NyaXB0aW9uIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5yZXZpZXcgPSBvYmoucmV2aWV3IHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5hYnN0cmFjdEl0ZW1zID0gb2JqLmFic3RyYWN0SXRlbXMgfHwgW107XHJcbiAgICAgICAgdGhpcy5xdW90ZXNBbW91bnQgPSBvYmoucXVvdGVzQW1vdW50IHx8IDA7XHJcbiAgICAgICAgdGhpcy5ub3Rlc0Ftb3VudCA9IG9iai5ub3Rlc0Ftb3VudCB8fCAwO1xyXG5cclxuICAgICAgICBpZiAoIW9iai5hZGRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZGVkID0gbmV3IERhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubW9kaWZpZWQgPSBvYmoubW9kaWZpZWQgfHwgbmV3IERhdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGN1cnJlbnRCb29rcyA9IFtdO1xyXG5cclxuICAgIEJvb2tGYWN0b3J5LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSkge1xyXG4gICAgICAgICAgICBjdXJyZW50Qm9va3MgPSBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3VycmVudEJvb2tzLnB1c2godGhpcyk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jvb2tzJywgYW5ndWxhci50b0pzb24oY3VycmVudEJvb2tzKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIEJvb2tGYWN0b3J5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgICBpc05ldyA9IHRydWU7XHJcbiAgICAgICAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSkge1xyXG4gICAgICAgICAgICB0aGF0LnNhdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdXJyZW50Qm9va3MgPSBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGN1cnJlbnRCb29rcywgZnVuY3Rpb24gKG9iaiwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmouaWQgPT0gdGhhdC5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0aGF0LCBmdW5jdGlvbiAodmFsdWUsIHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wZXJ0eV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYm9va3MnLCBhbmd1bGFyLnRvSnNvbihjdXJyZW50Qm9va3MpKTtcclxuICAgICAgICAgICAgICAgICAgICBpc05ldyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKGlzTmV3KSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnNhdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgQm9va0ZhY3RvcnkucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAgIGN1cnJlbnRCb29rcyA9IGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goY3VycmVudEJvb2tzLCBmdW5jdGlvbiAob2JqLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5pZCA9PSB0aGF0LmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEJvb2tzLnNwbGljZShpbmRleCwgMSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdib29rcycsIGFuZ3VsYXIudG9Kc29uKGN1cnJlbnRCb29rcykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIEJvb2tGYWN0b3J5O1xyXG59KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5mYWN0b3J5KCdCb29rcycsIGZ1bmN0aW9uIEJvb2tzRmFjdG9yeSgkaHR0cCwgQm9vaykge1xyXG4gICAgdmFyIGZhY3RvcnkgPSB7fTtcclxuICAgIGZhY3RvcnkuZGVmYXVsdGNvdmVyID0gXCJpbWFnZXMvVGhlX0Jvb2tfKEZyb250X0NvdmVyKS5qcGdcIjtcclxuICAgIGZhY3RvcnkuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmF3Qm9va3NBcnJheSA9ICRodHRwLmdldChcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2Jvb2tzL3YxL3VzZXJzLzExNDg3MzIyOTI0MDMzNjM1MDEzNC9ib29rc2hlbHZlcy8wL3ZvbHVtZXNcIik7XHJcbiAgICAgICAgcmF3Qm9va3NBcnJheS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICB2YXIgYm9vaywgZWxtLCBvYmosIGFwcEJvb2tzID0gcmVzcG9uc2UuaXRlbXM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGFwcEJvb2tzKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBhcHBCb29rc1twcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICBvYmogPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGVsbS5pZCxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZWxtLnZvbHVtZUluZm8udGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yOiBlbG0udm9sdW1lSW5mby5hdXRob3JzLFxyXG4gICAgICAgICAgICAgICAgICAgIHB1Ymxpc2hlcjogZWxtLnZvbHVtZUluZm8ucHVibGlzaGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uRGF0ZTogZWxtLnZvbHVtZUluZm8ucHVibGlzaGVkRGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogZWxtLnZvbHVtZUluZm8uaW1hZ2VMaW5rcy50aHVtYm5haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IGVsbS52b2x1bWVJbmZvLmNhdGVnb3JpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoOiBlbG0udm9sdW1lSW5mby5wYWdlQ291bnQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGVsbS52b2x1bWVJbmZvLmRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib29rID0gbmV3IEJvb2sob2JqKTtcclxuICAgICAgICAgICAgICAgIGJvb2sudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy93aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcblxyXG4gICAgY29uc29sZS5sb2cobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKSB7XHJcbiAgICAgICAgICAgIGZhY3RvcnkuaW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pKCk7XHJcblxyXG5cclxuICAgIGZhY3RvcnkuZ2V0QWxsQm9va3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgfTtcclxuICAgIGZhY3RvcnkuZ2V0Qm9va0J5SUQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICB2YXIgYm9va3MgPSBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvb2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChib29rc1tpXS5pZCA9PT0gaWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBib29rc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGZhY3Rvcnk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zY3JpcHRzIn0=