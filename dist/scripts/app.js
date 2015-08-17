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

        $scope.closeAbstracts = function ($event) {
            var target = $event.target;

            if (!$(target).hasClass('review') && !$(target).hasClass('quote') && !$(target).hasClass('note')) {
                $('article').find('.btn-box').hide();
                $('article').removeClass('opened');
            }
        }

        $scope.toggleButtons = function ($event) {
            var target = $event.target;

            if (!$(target).hasClass('opened')) {
                $('article').find('.btn-box').hide();
                $('article').removeClass('opened');
            }
            $($event.currentTarget).find('.btn-box').toggle();
            $($event.currentTarget).toggleClass('opened');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWJzdHJhY3QtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWRkLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rLWNvbnRlbnQtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stZWRpdC1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYm9vay1pbmZvLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rcy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcmFuZG9tLXF1b3Rlcy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvc2VhcmNoLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9zdGF0aXN0aWNzLWNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL2FkZC1jYW5jZWwtYnRuLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvYWRkZWQtbW9kaWZpZWQtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9ib29rLXNlYXJjaC1zZWN0aW9uLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvZGV0YWlscy1mbGFncy1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL2VkaXQtZGVsZXRlLWJ0bi1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL2ZpbHRlci1hYnN0cmFjdC1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL21haW4tbmF2LmpzIiwiZGlyZWN0aXZlcy9xdWljay1zdGF0aXN0aWNzLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvcmFuZG9tLXF1b3RlLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvc2F2ZS1jYW5jZWwtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9zdGF0aXN0aWNzLXNlY3Rpb24tZGlyZWN0aXZlLmpzIiwiZmlsdGVycy9hYnN0cmFjdC1maWx0ZXIuanMiLCJqcy9tYWluLmpzIiwic2VydmljZXMvYm9vay1mYWN0b3J5LmpzIiwic2VydmljZXMvYm9va3MtZmFjdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicsIFsnbmdSb3V0ZSddKS5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xyXG4gICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9ib29rcydcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va3NDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va3NDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9zZWFyY2gnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL3NlYXJjaC9pbmRleC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NlYXJjaENvbnRyb2xsZXInXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL3N0YXRpc3RpY3MnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL3N0YXRpc3RpY3MvaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTdGF0aXN0aWNzQ29udHJvbGxlcidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYWRkJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQWRkQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tBZGRDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvaW5mbycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZGV0YWlscy9pbmZvLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va0luZm9Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va0luZm9DdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvYWJzdHJhY3QnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2RldGFpbHMvYWJzdHJhY3QuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQWJzdHJhY3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va0Fic3RyQ3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MvOmlkL2NvbnRlbnQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2RldGFpbHMvY29udGVudC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tDb250ZW50Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tDb250Q3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MvOmlkL2VkaXQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2VkaXQuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rRWRpdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rRWRpdEN0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAub3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9ib29rcydcclxuICAgICAgICB9KVxyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rQWJzdHJhY3RDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0Jvb2snLCAnQm9va3MnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2ssIEJvb2tzKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuICAgICAgICAkc2NvcGUuY3VycmVudFRhYiA9ICdhYnN0cic7XHJcblxyXG4gICAgICAgICRzY29wZS50eXBlc1RvU2hvdyA9IHtcclxuICAgICAgICAgICAgcXVvdGVzOiB0cnVlLFxyXG4gICAgICAgICAgICBub3RlczogdHJ1ZSxcclxuICAgICAgICAgICAgcmV2aWV3OiB0cnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQgPSB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdxdW90ZScsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6ICcnLFxyXG4gICAgICAgICAgICBpbmRleDogbnVsbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5pc0N1cnJlbnQgPSBmdW5jdGlvbiAodGFiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuY3VycmVudFRhYiA9PT0gdGFiO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUuaW5jcmVhc2VOb3Rlc0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2subm90ZXNBbW91bnQrKztcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS5pbmNyZWFzZVF1b3Rlc0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2sucXVvdGVzQW1vdW50Kys7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc2NvcGUuZGVjcmVhc2VOb3Rlc0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2subm90ZXNBbW91bnQtLTtcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS5kZWNyZWFzZVF1b3Rlc0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2sucXVvdGVzQW1vdW50LS07XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgJHNjb3BlLnNob3dBbGxBYnN0cmFjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnR5cGVzVG9TaG93ID0ge1xyXG4gICAgICAgICAgICAgICAgcXVvdGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbm90ZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZXZpZXc6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5jbG9zZUFic3RyYWN0cyA9IGZ1bmN0aW9uICgkZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldCA9ICRldmVudC50YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoISQodGFyZ2V0KS5oYXNDbGFzcygncmV2aWV3JykgJiYgISQodGFyZ2V0KS5oYXNDbGFzcygncXVvdGUnKSAmJiAhJCh0YXJnZXQpLmhhc0NsYXNzKCdub3RlJykpIHtcclxuICAgICAgICAgICAgICAgICQoJ2FydGljbGUnKS5maW5kKCcuYnRuLWJveCcpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICQoJ2FydGljbGUnKS5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS50b2dnbGVCdXR0b25zID0gZnVuY3Rpb24gKCRldmVudCkge1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJGV2ZW50LnRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIGlmICghJCh0YXJnZXQpLmhhc0NsYXNzKCdvcGVuZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnYXJ0aWNsZScpLmZpbmQoJy5idG4tYm94JykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgJCgnYXJ0aWNsZScpLnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkKCRldmVudC5jdXJyZW50VGFyZ2V0KS5maW5kKCcuYnRuLWJveCcpLnRvZ2dsZSgpO1xyXG4gICAgICAgICAgICAkKCRldmVudC5jdXJyZW50VGFyZ2V0KS50b2dnbGVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgICRzY29wZS51cGRhdGVCb29rQWJzdHIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLm1vZGlmaWVkID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRib29rID0gbmV3IEJvb2soJHNjb3BlLmJvb2spO1xyXG4gICAgICAgICAgICBjdXJyZW50Ym9vay51cGRhdGUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuYWRkQWJzdHJJdGVtID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGVkaXRlZEl0ZW0gPSAkc2NvcGUuYWJzdHJJdGVtVG9BZGQsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50SXRlbSA9ICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXNbJHNjb3BlLmFic3RySXRlbVRvQWRkLmluZGV4XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlZGl0ZWRJdGVtLmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlZGl0ZWRJdGVtLmluZGV4ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkaXRlZEl0ZW0udHlwZSA9PT0gJ3JldmlldycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJvb2sucmV2aWV3ID0gZWRpdGVkSXRlbS5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXMucHVzaChlZGl0ZWRJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVkaXRlZEl0ZW0udHlwZSA9PT0gJ3F1b3RlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmluY3JlYXNlUXVvdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5jcmVhc2VOb3Rlc0Ftb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEl0ZW0udHlwZSA9PT0gJ25vdGUnICYmIGVkaXRlZEl0ZW0udHlwZSA9PT0gJ3F1b3RlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGVjcmVhc2VOb3Rlc0Ftb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5jcmVhc2VRdW90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRJdGVtLnR5cGUgPT09ICdxdW90ZScgJiYgZWRpdGVkSXRlbS50eXBlID09PSAnbm90ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRlY3JlYXNlUXVvdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmNyZWFzZU5vdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlZGl0ZWRJdGVtLnR5cGUgPT09ICdyZXZpZXcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5ib29rLnJldmlldyA9IGVkaXRlZEl0ZW0uY29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRlbGV0ZUFic3RySXRlbShlZGl0ZWRJdGVtLmluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3F1b3RlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SXRlbS5jb250ZW50ID0gZWRpdGVkSXRlbS5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJdGVtLnR5cGUgPSBlZGl0ZWRJdGVtLnR5cGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3F1b3RlJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAnJyxcclxuICAgICAgICAgICAgICAgICAgICBpbmRleDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlQm9va0Fic3RyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuZWRpdEFic3RySXRlbSA9IGZ1bmN0aW9uICgkaW5kZXgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkLnR5cGUgPSAkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zWyRpbmRleF0udHlwZTtcclxuICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkLmNvbnRlbnQgPSAkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zWyRpbmRleF0uY29udGVudDtcclxuICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkLmluZGV4ID0gJGluZGV4O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUJvb2tBYnN0cigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5kZWxldGVBYnN0ckl0ZW0gPSBmdW5jdGlvbiAoJGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zWyRpbmRleF0udHlwZSA9PT0gJ3F1b3RlJykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmRlY3JlYXNlUXVvdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJHNjb3BlLmJvb2suYWJzdHJhY3RJdGVtc1skaW5kZXhdLnR5cGUgPT09ICdub3RlJykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmRlY3JlYXNlTm90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zLnNwbGljZShbJGluZGV4XSwgMSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlQm9va0Fic3RyKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmVkaXRSZXZpZXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZC50eXBlID0gJ3Jldmlldyc7XHJcbiAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZC5jb250ZW50ID0gJHNjb3BlLmJvb2sucmV2aWV3O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUJvb2tBYnN0cigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5kZWxldGVSZXZpZXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLnJldmlldyA9IG51bGw7XHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVCb29rQWJzdHIoKTtcclxuICAgICAgICB9O1xyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rQWRkQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0Jvb2snLCAnQm9va3MnLCBmdW5jdGlvbiAoJHNjb3BlLCBCb29rLCBCb29rcykge1xyXG5cclxuICAgICAgICAkc2NvcGUuZ2VuZXJhdGVJZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHJhbmRvbUlkID0gJyc7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmFuZG9tSWQgKz0gTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiA5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tSWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuYm9vayA9IHt9O1xyXG5cclxuICAgICAgICAkc2NvcGUuYWRkQm9vayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5ib29rLnJhdGUpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5ib29rLnJhdGUgPSBbJzEgc3RhcicsICcyIHN0YXJzJywgJzMgc3RhcnMnLCAnNCBzdGFycycsICc1IHN0YXJzJ10uc2xpY2UoMCwgJHNjb3BlLmJvb2sucmF0ZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBmb3IgaXRlcmF0aW5nIHJhdGUtc3RhcnNcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBsb29rcyBwcmV0dHkgc3RyYW5nZSwgYnV0IGl0IGlzIHRoZSBlYXNpZXN0IGhlbHBlciBmb3IgbmctcmVwZWF0IHdoaWNoIEkndmUgZGlzY292ZXJlZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLmlkID0gJHNjb3BlLmdlbmVyYXRlSWQoKTtcclxuICAgICAgICAgICAgbmV3IEJvb2soJHNjb3BlLmJvb2spLnNhdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va0NvbnRlbnRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0Jvb2snLCAnQm9va3MnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2ssIEJvb2tzKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuICAgICAgICAkc2NvcGUuY3VycmVudFRhYiA9ICdjb250JztcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzQ3VycmVudCA9IGZ1bmN0aW9uICh0YWIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5jdXJyZW50VGFiID09PSB0YWI7XHJcbiAgICAgICAgfVxyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rRWRpdENvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQm9vaycsICdCb29rcycsIGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9vaywgQm9va3MpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG5cclxuICAgICAgICAkc2NvcGUuZWRpdGVkQm9va0luZm8gPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBwYXJhbSBpbiAkc2NvcGUuYm9vaykge1xyXG4gICAgICAgICAgICAkc2NvcGUuZWRpdGVkQm9va0luZm9bcGFyYW1dID0gJHNjb3BlLmJvb2tbcGFyYW1dO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheSgkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSkpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnJhdGUgPSAkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuc2F2ZUNoYW5nZXMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnJhdGUpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5lZGl0ZWRCb29rSW5mby5yYXRlID0gWycxIHN0YXInLCAnMiBzdGFycycsICczIHN0YXJzJywgJzQgc3RhcnMnLCAnNSBzdGFycyddLnNsaWNlKDAsICRzY29wZS5lZGl0ZWRCb29rSW5mby5yYXRlKTtcclxuICAgICAgICAgICAgICAgIC8vIGZvciBpdGVyYXRpbmcgcmF0ZS1zdGFyc1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGxvb2tzIHByZXR0eSBzdHJhbmdlLCBidXQgaXQgaXMgdGhlIGVhc2llc3QgaGVscGVyIGZvciBuZy1yZXBlYXQgd2hpY2ggSSd2ZSBkaXNjb3ZlcmVkXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHBhcmFtIGluICRzY29wZS5lZGl0ZWRCb29rSW5mbykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmJvb2tbcGFyYW1dID0gJHNjb3BlLmVkaXRlZEJvb2tJbmZvW3BhcmFtXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmJvb2subW9kaWZpZWQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBuZXcgQm9vaygkc2NvcGUuYm9vaykudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tJbmZvQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdCb29rJywgJ0Jvb2tzJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBCb29rLCBCb29rcykge1xyXG5cclxuICAgICAgICAkc2NvcGUuYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRUYWIgPSAnaW5mbyc7XHJcblxyXG4gICAgICAgICRzY29wZS5pc0N1cnJlbnQgPSBmdW5jdGlvbiAodGFiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuY3VycmVudFRhYiA9PT0gdGFiO1xyXG4gICAgICAgIH1cclxuXHJcbn1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0Jvb2tzJywgJ0Jvb2snLCBmdW5jdGlvbiAoJHNjb3BlLCBCb29rcywgQm9vaykge1xyXG5cclxuICAgICAgICAkc2NvcGUuYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpO1xyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ3JhbmRvbVF1b3RlQ29udHJvbGxlcicsIFsnQm9va3MnLCAnJHJvdXRlUGFyYW1zJywgZnVuY3Rpb24gKEJvb2tzLCAkcm91dGVQYXJhbXMpIHtcclxuICAgICAgICB2YXIgY29udHJvbGxlciA9IHRoaXM7XHJcbiAgICAgICAgY29udHJvbGxlci5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuICAgICAgICBjb250cm9sbGVyLnF1b3Rlc0Ftb3VudCA9IGNvbnRyb2xsZXIuYm9vay5xdW90ZXNBbW91bnQ7XHJcbiAgICAgICAgY29udHJvbGxlci5xdW90ZXMgPSBbXTtcclxuICAgICAgICBjb250cm9sbGVyLnJhbmRvbVF1b3RlID0gJ2tha2EnO1xyXG5cclxuICAgICAgICBjb250cm9sbGVyLmJvb2suYWJzdHJhY3RJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdxdW90ZScpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIucXVvdGVzLnB1c2goaXRlbS5jb250ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb250cm9sbGVyLmNob29zZVJhbmRvbVF1b3RlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb250cm9sbGVyLnF1b3Rlc0Ftb3VudCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIucmFuZG9tUXVvdGUgPSBjb250cm9sbGVyLnF1b3Rlc1tyYW5kb21JbmRleF07XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb250cm9sbGVyLmNob29zZVJhbmRvbVF1b3RlKCk7XHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoY29udHJvbGxlci5jaG9vc2VSYW5kb21RdW90ZSwgMTAwMCk7XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpLmNvbnRyb2xsZXIoJ1NlYXJjaENvbnRyb2xsZXInLCBbJyRzY29wZScsICckaHR0cCcsICdCb29rcycsICdCb29rJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsIEJvb2tzLCBCb29rKSB7XHJcblx0JHNjb3BlLnN1Ym1pdFNlYXJjaCA9IGZ1bmN0aW9uIChmb3JtKSB7XHJcblx0XHRpZiAoZm9ybS4kdmFsaWQpIHtcclxuXHRcdFx0dmFyIHVybDtcclxuXHRcdFx0JHNjb3BlLnRlbXBCb29rcyA9IFtdO1xyXG5cdFx0XHQkc2NvcGUuaW5kaWNlc0FkZGVkID0gW107XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoJHNjb3BlLnNlYXJjaFBhcmFtLmJ5VGVybSA9PSBcImFsbFwiKXtcclxuXHRcdFx0XHR1cmwgPSBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2Jvb2tzL3YxL3ZvbHVtZXM/cT1cIiskc2NvcGUuc2VhcmNoUGFyYW0udGV4dCtcIiZtYXhSZXN1bHRzPTIwXCI7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dXJsID0gXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9ib29rcy92MS92b2x1bWVzP3E9XCIrJHNjb3BlLnNlYXJjaFBhcmFtLmJ5VGVybStcIjpcIiskc2NvcGUuc2VhcmNoUGFyYW0udGV4dCtcIiZtYXhSZXN1bHRzPTIwXCI7XHJcblx0XHRcdH1cclxuXHRcdFx0JGh0dHAuZ2V0KHVybCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2UudG90YWxJdGVtcyA+IDApe1xyXG5cdFx0XHRcdFx0dmFyIGVsbSwgb2JqLCBhcHBCb29rcyA9IHJlc3BvbnNlLml0ZW1zO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgcHJvcGVydHkgaW4gYXBwQm9va3MpIHtcclxuXHRcdFx0XHRcdFx0ZWxtID0gYXBwQm9va3NbcHJvcGVydHldO1xyXG5cdFx0XHRcdFx0XHRvYmogPSB7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IGVsbS5pZCxcclxuXHRcdFx0XHRcdFx0XHR0aXRsZTogZWxtLnZvbHVtZUluZm8udGl0bGUsXHJcblx0XHRcdFx0XHRcdFx0YXV0aG9yOiBlbG0udm9sdW1lSW5mby5hdXRob3JzfHxcIlwiLFxyXG5cdFx0XHRcdFx0XHRcdGltYWdlOiBlbG0udm9sdW1lSW5mby5pbWFnZUxpbmtzID8gZWxtLnZvbHVtZUluZm8uaW1hZ2VMaW5rcy50aHVtYm5haWwgOiBCb29rcy5kZWZhdWx0Y292ZXIsXHJcblx0XHRcdFx0XHRcdFx0cHVibGlzaGVyOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZXIsXHJcblx0XHRcdFx0XHRcdFx0cHVibGljYXRpb25EYXRlOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZWREYXRlLFxyXG5cdFx0XHRcdFx0XHRcdGNhdGVnb3J5OiBlbG0udm9sdW1lSW5mby5jYXRlZ29yaWVzLFxyXG5cdFx0XHRcdFx0XHRcdGxlbmd0aDogZWxtLnZvbHVtZUluZm8ucGFnZUNvdW50LFxyXG5cdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBlbG0udm9sdW1lSW5mby5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRpc0FkZGVkIDogZmFsc2VcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoQm9va3MuZ2V0Qm9va0J5SUQoZWxtLmlkKSl7XHJcblx0XHRcdFx0XHRcdFx0b2JqLmlzQWRkZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCRzY29wZS50ZW1wQm9va3MucHVzaChvYmopO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0JHNjb3BlLmFkZEJvb2sgPSBmdW5jdGlvbihpbmRleCwgYm9vaykge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudGVtcEJvb2tzW2luZGV4XS5pc0FkZGVkID0gdHJ1ZTsgIFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHZhciBuZXdCb29rID0gbmV3IEJvb2soYm9vayk7XHJcblx0XHRcdFx0XHRcdG5ld0Jvb2suc2F2ZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0JHNjb3BlLm5vUmVzdWx0cyA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQkc2NvcGUubm9SZXN1bHRzID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpLmNvbnRyb2xsZXIoJ1N0YXRpc3RpY3NDb250cm9sbGVyJywgWyckc2NvcGUnLCAnQm9va3MnLCAnQm9vaycsIGZ1bmN0aW9uICgkc2NvcGUsIEJvb2tzLCBCb29rKSB7XHJcblx0dmFyIGJvb2tzID0gQm9va3MuZ2V0QWxsQm9va3MoKSxcclxuXHRcdHN1bVF1b3RlcyA9IDAsXHJcblx0XHRzdW1Ob3RlcyA9IDAsXHJcblx0XHRzdW1SZXZpZXcgPSAwLFxyXG5cdFx0c3VtQm9va3NRdW90ZXMgPSAwLFxyXG5cdFx0c3VtQm9va3NOb3RlcyA9IDAsXHJcblx0XHRhbW91bnRQYWdlcyA9IDAsXHJcblx0XHRhdmFyYWdlUXVvdGVzLFxyXG5cdFx0YXZhcmFnZU5vdGVzO1xyXG5cdFxyXG5cclxuXHRhbmd1bGFyLmZvckVhY2goYm9va3MsIGZ1bmN0aW9uIChvYmopIHtcclxuXHRcdGlmIChvYmoucXVvdGVzQW1vdW50KSB7XHJcblx0XHRcdHN1bUJvb2tzUXVvdGVzKys7XHJcblx0XHRcdHN1bVF1b3RlcyArPSBvYmoucXVvdGVzQW1vdW50O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAob2JqLm5vdGVzQW1vdW50KSB7XHJcblx0XHRcdHN1bUJvb2tzTm90ZXMrKztcclxuXHRcdFx0c3VtTm90ZXMgKz0gb2JqLm5vdGVzQW1vdW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChvYmoucmV2aWV3KXtcclxuXHRcdFx0c3VtUmV2aWV3Kys7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYob2JqLmxlbmd0aCl7XHJcblx0XHRcdGFtb3VudFBhZ2VzICs9IG9iai5sZW5ndGg7XHJcblx0XHR9XHRcdFxyXG5cdH0pO1xyXG5cclxuXHRhdmFyYWdlUXVvdGVzID0gcGFyc2VJbnQoIHN1bVF1b3RlcyAvIGJvb2tzLmxlbmd0aCk7XHJcblx0YXZhcmFnZU5vdGVzID0gcGFyc2VJbnQoIHN1bU5vdGVzIC8gYm9va3MubGVuZ3RoKTtcclxuXHJcblx0JHNjb3BlLnN0YXRpc3RpY3MgPSB7XHJcblx0XHRhbW91bnRCb29rczogYm9va3MubGVuZ3RoLFxyXG5cdFx0YXZhcmFnZU5vdGVzOiBhdmFyYWdlTm90ZXMsXHJcblx0XHRzdW1Cb29rc05vdGVzOiBzdW1Cb29rc05vdGVzLFxyXG5cdFx0YXZhcmFnZVF1b3RlczogYXZhcmFnZVF1b3RlcyxcdFx0XHJcblx0XHRzdW1Cb29rc1F1b3Rlczogc3VtQm9va3NRdW90ZXMsXHJcblx0XHRxdW90ZXNBbW91bnRBbGw6IHN1bVF1b3RlcyxcclxuXHRcdG5vdGVzQW1vdW50QWxsOiBzdW1Ob3RlcyxcclxuXHRcdHJldmlld0Ftb3VudEFsbDogc3VtUmV2aWV3XHRcclxuXHR9O1xyXG5cdCRzY29wZS5ib29rcyA9IGJvb2tzO1xyXG5cclxuXHQkc2NvcGUuZ2V0UmFuZG9tID0gZnVuY3Rpb24obWluLG1heCl7XHJcblx0ICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuXHR9XHJcblxyXG5cdCRzY29wZS5ib29rc0hlaWdodCA9IHBhcnNlSW50KGFtb3VudFBhZ2VzICogMC4zIC8gMTApO1xyXG5cclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdhZGRDYW5jZWxCdG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9hZGQtY2FuY2VsLWJ0bi5odG1sJ1xyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnYWRkZWRNb2RpZmllZCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9hZGRlZC1tb2RpZmllZC1zZWN0aW9uLmh0bWwnLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnYm9va1NlYXJjaFNlY3Rpb24nLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvYm9vay1zZWFyY2gtc2VjdGlvbi5odG1sJyxcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ2RldGFpbHNGbGFncycsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9kZXRhaWxzLWZsYWdzLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHJvdXRlUGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZm9Vcmw6ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2luZm8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRVcmw6ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2NvbnRlbnQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFic3RyYWN0VXJsOiAnIy9ib29rcy8nICsgJHJvdXRlUGFyYW1zLmlkICsgJy9hYnN0cmFjdCdcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2ZsYWdzQ3RybCdcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ2VkaXREZWxldGVCdG4nLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvZWRpdC1kZWxldGUtYnRuLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHJvdXRlUGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXRQYWdlVXJsOiAnIy9ib29rcy8nICsgJHJvdXRlUGFyYW1zLmlkICsgJy9lZGl0J1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnZWRpdERlbEN0cmwnXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdmaWx0ZXJBYnN0cmFjdCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9maWx0ZXItYWJzdHIuaHRtbCcsXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdtYWluTmF2JywgZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL21haW4tbmF2Lmh0bWwnLFxyXG4gICAgICAgICAgICBzY29wZTogdHJ1ZSxcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsYXNzID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuZmluZChcImEuYnRuLW1lbnVcIikub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5jbGFzcyA9PSBcIlwiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsYXNzID0gXCJhY3RpdmVcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbGFzcyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7ICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uICh2aWV3TG9jYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZpZXdMb2NhdGlvbiA9PT0gJGxvY2F0aW9uLnBhdGgoKTtcclxuICAgICAgICAgICAgICAgIH07ICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgncXVpY2tTdGF0aXN0aWNzJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL3F1aWNrLXN0YXRpc3RpY3MuaHRtbCcsXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdyYW5kb21RdW90ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL3JhbmRvbS1xdW90ZS5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ3JhbmRvbVF1b3RlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3F1b3RlQ3RybCdcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnc2F2ZUNhbmNlbEJ0bicsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9zYXZlLWNhbmNlbC1idG4uaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkcm91dGVQYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja1VybDogJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvaW5mbydcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3NhdmVDYW5jZWxDdHJsJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnc3RhdGlzdGljc1NlY3Rpb24nLCBbJ0Jvb2tzJywgZnVuY3Rpb24gKEJvb2tzKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9zdGF0aXN0aWNzLXNlY3Rpb24uaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdzdGF0U2VjQ3RybCdcclxuICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZmlsdGVyKCdhYnN0cmFjdEZpbHRlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGl0ZW1zLCB0eXBlc1RvU2hvdykge1xyXG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlc1RvU2hvdy5xdW90ZXMgJiYgdHlwZXNUb1Nob3cubm90ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdHlwZXNUb1Nob3cucXVvdGVzICYmIHR5cGVzVG9TaG93Lm5vdGVzICYmIGl0ZW0udHlwZSA9PT0gJ25vdGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZXNUb1Nob3cucXVvdGVzICYmICF0eXBlc1RvU2hvdy5ub3RlcyAmJiBpdGVtLnR5cGUgPT09ICdxdW90ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZDtcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbiIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkYXNpZGVsaW5rID0gJCgnLmFzaWRlLWxpbmsnKSwgJHdyYXBzaWRlYmFyID0gJCgnLmNvbnRlbnQnKSwgJGJ0bm1lbnUgPSAkKCcuYnRuLW1lbnUnKTtcclxuICAgICRhc2lkZWxpbmsuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRhc2lkZWxpbmsudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICR3cmFwc2lkZWJhci50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICBcclxuXHJcbn0pO1xyXG4gICAgIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5mYWN0b3J5KCdCb29rJywgZnVuY3Rpb24gQm9va0ZhY3RvcnkoKSB7XHJcblxyXG4gICAgdmFyIEJvb2tGYWN0b3J5ID0gZnVuY3Rpb24gKG9iaikge1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gb2JqLmlkO1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSBvYmoudGl0bGUgfHwgbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKG9iai5hdXRob3IpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShvYmouYXV0aG9yKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRob3IgPSBvYmouYXV0aG9yLmpvaW4oJywgJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhvciA9IG9iai5hdXRob3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhvciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmltYWdlID0gb2JqLmltYWdlIHx8IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChvYmouY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShvYmouY2F0ZWdvcnkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhdGVnb3J5ID0gb2JqLmNhdGVnb3J5LmpvaW4oJywgJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhdGVnb3J5ID0gb2JqLmNhdGVnb3J5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXRlZ29yeSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnB1Ymxpc2hlciA9IG9iai5wdWJsaXNoZXIgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLnB1YmxpY2F0aW9uRGF0ZSA9IG9iai5wdWJsaWNhdGlvbkRhdGUgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IG9iai5sZW5ndGggfHwgbnVsbDtcclxuICAgICAgICB0aGlzLnJhdGUgPSBvYmoucmF0ZSB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBvYmouZGVzY3JpcHRpb24gfHwgbnVsbDtcclxuICAgICAgICB0aGlzLnJldmlldyA9IG9iai5yZXZpZXcgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLmFic3RyYWN0SXRlbXMgPSBvYmouYWJzdHJhY3RJdGVtcyB8fCBbXTtcclxuICAgICAgICB0aGlzLnF1b3Rlc0Ftb3VudCA9IG9iai5xdW90ZXNBbW91bnQgfHwgMDtcclxuICAgICAgICB0aGlzLm5vdGVzQW1vdW50ID0gb2JqLm5vdGVzQW1vdW50IHx8IDA7XHJcblxyXG4gICAgICAgIGlmICghb2JqLmFkZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkZWQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tb2RpZmllZCA9IG9iai5tb2RpZmllZCB8fCBuZXcgRGF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgY3VycmVudEJvb2tzID0gW107XHJcblxyXG4gICAgQm9va0ZhY3RvcnkucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRCb29rcyA9IGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50Qm9va3MucHVzaCh0aGlzKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYm9va3MnLCBhbmd1bGFyLnRvSnNvbihjdXJyZW50Qm9va3MpKTtcclxuICAgIH07XHJcblxyXG4gICAgQm9va0ZhY3RvcnkucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAgIGlzTmV3ID0gdHJ1ZTtcclxuICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKSB7XHJcbiAgICAgICAgICAgIHRoYXQuc2F2ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRCb29rcyA9IGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goY3VycmVudEJvb2tzLCBmdW5jdGlvbiAob2JqLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5pZCA9PSB0aGF0LmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRoYXQsIGZ1bmN0aW9uICh2YWx1ZSwgcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdib29rcycsIGFuZ3VsYXIudG9Kc29uKGN1cnJlbnRCb29rcykpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzTmV3ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoaXNOZXcpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuc2F2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBCb29rRmFjdG9yeS5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdkZWxldGUnKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIEJvb2tGYWN0b3J5O1xyXG59KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5mYWN0b3J5KCdCb29rcycsIGZ1bmN0aW9uIEJvb2tzRmFjdG9yeSgkaHR0cCwgQm9vaykge1xyXG4gICAgdmFyIGZhY3RvcnkgPSB7fTtcclxuICAgIGZhY3RvcnkuZGVmYXVsdGNvdmVyID0gXCJpbWFnZXMvVGhlX0Jvb2tfKEZyb250X0NvdmVyKS5qcGdcIjtcclxuICAgIGZhY3RvcnkuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmF3Qm9va3NBcnJheSA9ICRodHRwLmdldChcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2Jvb2tzL3YxL3VzZXJzLzExNDg3MzIyOTI0MDMzNjM1MDEzNC9ib29rc2hlbHZlcy8wL3ZvbHVtZXNcIik7XHJcbiAgICAgICAgcmF3Qm9va3NBcnJheS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICB2YXIgYm9vaywgZWxtLCBvYmosIGFwcEJvb2tzID0gcmVzcG9uc2UuaXRlbXM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGFwcEJvb2tzKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBhcHBCb29rc1twcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICBvYmogPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGVsbS5pZCxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZWxtLnZvbHVtZUluZm8udGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yOiBlbG0udm9sdW1lSW5mby5hdXRob3JzLFxyXG4gICAgICAgICAgICAgICAgICAgIHB1Ymxpc2hlcjogZWxtLnZvbHVtZUluZm8ucHVibGlzaGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uRGF0ZTogZWxtLnZvbHVtZUluZm8ucHVibGlzaGVkRGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogZWxtLnZvbHVtZUluZm8uaW1hZ2VMaW5rcy50aHVtYm5haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IGVsbS52b2x1bWVJbmZvLmNhdGVnb3JpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoOiBlbG0udm9sdW1lSW5mby5wYWdlQ291bnQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGVsbS52b2x1bWVJbmZvLmRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib29rID0gbmV3IEJvb2sob2JqKTtcclxuICAgICAgICAgICAgICAgIGJvb2sudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKSB7XHJcblx0XHRcdGZhY3RvcnkuaW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pKCk7XHJcblxyXG5cclxuICAgIGZhY3RvcnkuZ2V0QWxsQm9va3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgfTtcclxuICAgIGZhY3RvcnkuZ2V0Qm9va0J5SUQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICB2YXIgYm9va3MgPSBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvb2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChib29rc1tpXS5pZCA9PT0gaWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBib29rc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGZhY3Rvcnk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zY3JpcHRzIn0=