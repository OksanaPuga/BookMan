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
    .controller('BookAddController', ['$scope', 'Book', 'Books', 'Buttons', function ($scope, Book, Books, Buttons) {

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

        $scope.toggleUrlBtn = Buttons.toggleUrlBtn;

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
    .controller('BookEditController', ['$scope', '$routeParams', 'Book', 'Books', 'Buttons', function ($scope, $routeParams, Book, Books, Buttons) {

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
        
        $scope.toggleUrlBtn = Buttons.toggleUrlBtn;

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
    .controller('BooksController', ['$scope', 'Books', 'Book', 'Buttons', function ($scope, Books, Book, Buttons) {

		if (!localStorage.getItem('books')) {
		    Books.init().then(function(promise) {
		        $scope.books = Books.getAllBooks();          
		    });
		} else {
			$scope.books = Books.getAllBooks();
		}
        
        $scope.showShortInfo = Buttons.showShortInfo;

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
                $rootscope.isActiveAside = true;
                scope.closeAside = function() {
                    $rootscope.isActiveAside = false;
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
            controller: function ($scope) {
                $scope.books = Books.getAllBooks();
            }
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
        var promise = $http.get("https://www.googleapis.com/books/v1/users/114873229240336350134/bookshelves/0/volumes");
        promise.success(function (response) {
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
        return promise;
    };

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

angular.module('bookman')
    .factory('Buttons', function ButtonsFactory() {

        return Buttons = {
            toggleUrlBtn: function () {
                var $input = $('#image'),
                    $box = $('.cover-box'),
                    $message = $box.find('span');

                $input.show().focus();
                $message.hide();
                $input.on('focusout', function () {
                    if (!$input.val()) {
                        $message.html('add cover');
                    } else {
                        $message.html('change cover');
                    }
                    $message.show();
                    $input.hide()
                });
            },
            
            showShortInfo: function (e) {
                e.preventDefault();

                var $btn = $(e.target),
                    $book = $btn.closest('.book-instance'),
                    $box = $btn.closest('.book-instance').find('.more-info-box');
                
                $box.toggleClass('opened');
                $book.on('focusout', function () {
                    console.log('jeoewojewoewoewiowrio');
                    $box.removeClass('opened');
                });
            }
        }

    });

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWJzdHJhY3QtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWRkLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rLWNvbnRlbnQtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stZWRpdC1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYm9vay1pbmZvLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rcy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcmFuZG9tLXF1b3Rlcy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvc2VhcmNoLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9zdGF0aXN0aWNzLWNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL2FkZC1jYW5jZWwtYnRuLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvYWRkZWQtbW9kaWZpZWQtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9ib29rLXNlYXJjaC1zZWN0aW9uLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvZGV0YWlscy1mbGFncy1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL2VkaXQtZGVsZXRlLWJ0bi1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL2ZpbHRlci1hYnN0cmFjdC1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL21haW4tbmF2LWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvbW9kYWwtYmFja2Ryb3AtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9xdWljay1zdGF0aXN0aWNzLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvcmFuZG9tLXF1b3RlLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvc2F2ZS1jYW5jZWwtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9zdGF0aXN0aWNzLXNlY3Rpb24tZGlyZWN0aXZlLmpzIiwiZmlsdGVycy9hYnN0cmFjdC1maWx0ZXIuanMiLCJzZXJ2aWNlcy9ib29rLWZhY3RvcnkuanMiLCJzZXJ2aWNlcy9ib29rcy1mYWN0b3J5LmpzIiwic2VydmljZXMvYnV0dG9ucy1mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJywgWyduZ1JvdXRlJ10pLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgICAgICByZWRpcmVjdFRvOiAnL2Jvb2tzJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rc0N0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL3NlYXJjaCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvc2VhcmNoL2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU2VhcmNoQ29udHJvbGxlcidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvc3RhdGlzdGljcycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvc3RhdGlzdGljcy9pbmRleC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1N0YXRpc3RpY3NDb250cm9sbGVyJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9hYm91dCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYWJvdXQvaW5kZXguaHRtbCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYWRkJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQWRkQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tBZGRDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvaW5mbycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZGV0YWlscy9pbmZvLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va0luZm9Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va0luZm9DdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvYWJzdHJhY3QnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2RldGFpbHMvYWJzdHJhY3QuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQWJzdHJhY3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va0Fic3RyQ3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MvOmlkL2NvbnRlbnQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2RldGFpbHMvY29udGVudC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tDb250ZW50Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tDb250Q3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MvOmlkL2VkaXQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2VkaXQuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rRWRpdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rRWRpdEN0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAub3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9ib29rcydcclxuICAgICAgICB9KVxyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rQWJzdHJhY3RDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0Jvb2snLCAnQm9va3MnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2ssIEJvb2tzKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuICAgICAgICAkc2NvcGUuY3VycmVudFRhYiA9ICdhYnN0cic7XHJcblxyXG4gICAgICAgICRzY29wZS50eXBlc1RvU2hvdyA9IHtcclxuICAgICAgICAgICAgcXVvdGVzOiB0cnVlLFxyXG4gICAgICAgICAgICBub3RlczogdHJ1ZSxcclxuICAgICAgICAgICAgcmV2aWV3OiB0cnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQgPSB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdxdW90ZScsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6ICcnLFxyXG4gICAgICAgICAgICBpbmRleDogbnVsbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5pc0N1cnJlbnQgPSBmdW5jdGlvbiAodGFiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuY3VycmVudFRhYiA9PT0gdGFiO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUuaW5jcmVhc2VOb3Rlc0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2subm90ZXNBbW91bnQrKztcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS5pbmNyZWFzZVF1b3Rlc0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2sucXVvdGVzQW1vdW50Kys7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc2NvcGUuZGVjcmVhc2VOb3Rlc0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2subm90ZXNBbW91bnQtLTtcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS5kZWNyZWFzZVF1b3Rlc0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2sucXVvdGVzQW1vdW50LS07XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgJHNjb3BlLnNob3dBbGxBYnN0cmFjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnR5cGVzVG9TaG93ID0ge1xyXG4gICAgICAgICAgICAgICAgcXVvdGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbm90ZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZXZpZXc6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS50b2dnbGVCdXR0b25zID0gZnVuY3Rpb24gKCRldmVudCkge1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJGV2ZW50LmN1cnJlbnRUYXJnZXQ7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoISQodGFyZ2V0KS5oYXNDbGFzcygnb3BlbmVkJykpIHtcclxuICAgICAgICAgICAgICAgICQoJ2FydGljbGUnKS5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJCh0YXJnZXQpLnRvZ2dsZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgJHNjb3BlLnVwZGF0ZUJvb2tBYnN0ciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2subW9kaWZpZWQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudGJvb2sgPSBuZXcgQm9vaygkc2NvcGUuYm9vayk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRib29rLnVwZGF0ZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5hZGRBYnN0ckl0ZW0gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWRpdGVkSXRlbSA9ICRzY29wZS5hYnN0ckl0ZW1Ub0FkZCxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRJdGVtID0gJHNjb3BlLmJvb2suYWJzdHJhY3RJdGVtc1skc2NvcGUuYWJzdHJJdGVtVG9BZGQuaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVkaXRlZEl0ZW0uY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVkaXRlZEl0ZW0uaW5kZXggPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWRpdGVkSXRlbS50eXBlID09PSAncmV2aWV3Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYm9vay5yZXZpZXcgPSBlZGl0ZWRJdGVtLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJvb2suYWJzdHJhY3RJdGVtcy5wdXNoKGVkaXRlZEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWRpdGVkSXRlbS50eXBlID09PSAncXVvdGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5jcmVhc2VRdW90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmNyZWFzZU5vdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SXRlbS50eXBlID09PSAnbm90ZScgJiYgZWRpdGVkSXRlbS50eXBlID09PSAncXVvdGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kZWNyZWFzZU5vdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmNyZWFzZVF1b3Rlc0Ftb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEl0ZW0udHlwZSA9PT0gJ3F1b3RlJyAmJiBlZGl0ZWRJdGVtLnR5cGUgPT09ICdub3RlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGVjcmVhc2VRdW90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmluY3JlYXNlTm90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVkaXRlZEl0ZW0udHlwZSA9PT0gJ3JldmlldycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJvb2sucmV2aWV3ID0gZWRpdGVkSXRlbS5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGVsZXRlQWJzdHJJdGVtKGVkaXRlZEl0ZW0uaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncXVvdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJdGVtLmNvbnRlbnQgPSBlZGl0ZWRJdGVtLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEl0ZW0udHlwZSA9IGVkaXRlZEl0ZW0udHlwZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZCA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncXVvdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBudWxsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVCb29rQWJzdHIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5lZGl0QWJzdHJJdGVtID0gZnVuY3Rpb24gKCRpbmRleCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQudHlwZSA9ICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXNbJGluZGV4XS50eXBlO1xyXG4gICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQuY29udGVudCA9ICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXNbJGluZGV4XS5jb250ZW50O1xyXG4gICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQuaW5kZXggPSAkaW5kZXg7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKTtcclxuICAgICAgICAgICAgJCgndGV4dGFyZWEnKS5mb2N1cygpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUJvb2tBYnN0cigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5kZWxldGVBYnN0ckl0ZW0gPSBmdW5jdGlvbiAoJGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zWyRpbmRleF0udHlwZSA9PT0gJ3F1b3RlJykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmRlY3JlYXNlUXVvdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJHNjb3BlLmJvb2suYWJzdHJhY3RJdGVtc1skaW5kZXhdLnR5cGUgPT09ICdub3RlJykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmRlY3JlYXNlTm90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zLnNwbGljZShbJGluZGV4XSwgMSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlQm9va0Fic3RyKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmVkaXRSZXZpZXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZC50eXBlID0gJ3Jldmlldyc7XHJcbiAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZC5jb250ZW50ID0gJHNjb3BlLmJvb2sucmV2aWV3O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsMCk7XHJcbiAgICAgICAgICAgICQoJ3RleHRhcmVhJykuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVCb29rQWJzdHIoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuZGVsZXRlUmV2aWV3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5yZXZpZXcgPSBudWxsO1xyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlQm9va0Fic3RyKCk7XHJcbiAgICAgICAgfTtcclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va0FkZENvbnRyb2xsZXInLCBbJyRzY29wZScsICdCb29rJywgJ0Jvb2tzJywgJ0J1dHRvbnMnLCBmdW5jdGlvbiAoJHNjb3BlLCBCb29rLCBCb29rcywgQnV0dG9ucykge1xyXG5cclxuICAgICAgICAkc2NvcGUuZ2VuZXJhdGVJZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHJhbmRvbUlkID0gJyc7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmFuZG9tSWQgKz0gTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiA5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tSWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuYm9vayA9IHt9O1xyXG5cclxuICAgICAgICAkc2NvcGUuYWRkQm9vayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5ib29rLnJhdGUpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5ib29rLnJhdGUgPSBbJzEgc3RhcicsICcyIHN0YXJzJywgJzMgc3RhcnMnLCAnNCBzdGFycycsICc1IHN0YXJzJ10uc2xpY2UoMCwgJHNjb3BlLmJvb2sucmF0ZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBmb3IgaXRlcmF0aW5nIHJhdGUtc3RhcnNcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBsb29rcyBwcmV0dHkgc3RyYW5nZSwgYnV0IGl0IGlzIHRoZSBlYXNpZXN0IGhlbHBlciBmb3IgbmctcmVwZWF0IHdoaWNoIEkndmUgZGlzY292ZXJlZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLmlkID0gJHNjb3BlLmdlbmVyYXRlSWQoKTtcclxuICAgICAgICAgICAgbmV3IEJvb2soJHNjb3BlLmJvb2spLnNhdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS50b2dnbGVVcmxCdG4gPSBCdXR0b25zLnRvZ2dsZVVybEJ0bjtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rQ29udGVudENvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQm9vaycsICdCb29rcycsIGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9vaywgQm9va3MpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG4gICAgICAgICRzY29wZS5jdXJyZW50VGFiID0gJ2NvbnQnO1xyXG5cclxuICAgICAgICAkc2NvcGUuaXNDdXJyZW50ID0gZnVuY3Rpb24gKHRhYikge1xyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLmN1cnJlbnRUYWIgPT09IHRhYjtcclxuICAgICAgICB9XHJcbn1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tFZGl0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdCb29rJywgJ0Jvb2tzJywgJ0J1dHRvbnMnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2ssIEJvb2tzLCBCdXR0b25zKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmVkaXRlZEJvb2tJbmZvID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgcGFyYW0gaW4gJHNjb3BlLmJvb2spIHtcclxuICAgICAgICAgICAgJHNjb3BlLmVkaXRlZEJvb2tJbmZvW3BhcmFtXSA9ICRzY29wZS5ib29rW3BhcmFtXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnJhdGUpKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lZGl0ZWRCb29rSW5mby5yYXRlID0gJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnJhdGUubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLnNhdmVDaGFuZ2VzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCRzY29wZS5lZGl0ZWRCb29rSW5mby5yYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSA9IFsnMSBzdGFyJywgJzIgc3RhcnMnLCAnMyBzdGFycycsICc0IHN0YXJzJywgJzUgc3RhcnMnXS5zbGljZSgwLCAkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBmb3IgaXRlcmF0aW5nIHJhdGUtc3RhcnNcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBsb29rcyBwcmV0dHkgc3RyYW5nZSwgYnV0IGl0IGlzIHRoZSBlYXNpZXN0IGhlbHBlciBmb3IgbmctcmVwZWF0IHdoaWNoIEkndmUgZGlzY292ZXJlZFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBwYXJhbSBpbiAkc2NvcGUuZWRpdGVkQm9va0luZm8pIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5ib29rW3BhcmFtXSA9ICRzY29wZS5lZGl0ZWRCb29rSW5mb1twYXJhbV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLm1vZGlmaWVkID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgbmV3IEJvb2soJHNjb3BlLmJvb2spLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAkc2NvcGUudG9nZ2xlVXJsQnRuID0gQnV0dG9ucy50b2dnbGVVcmxCdG47XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va0luZm9Db250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0Jvb2snLCAnQm9va3MnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2ssIEJvb2tzKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuICAgICAgICAkc2NvcGUuY3VycmVudFRhYiA9ICdpbmZvJztcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzQ3VycmVudCA9IGZ1bmN0aW9uICh0YWIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5jdXJyZW50VGFiID09PSB0YWI7XHJcbiAgICAgICAgfVxyXG5cclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va3NDb250cm9sbGVyJywgWyckc2NvcGUnLCAnQm9va3MnLCAnQm9vaycsICdCdXR0b25zJywgZnVuY3Rpb24gKCRzY29wZSwgQm9va3MsIEJvb2ssIEJ1dHRvbnMpIHtcclxuXHJcblx0XHRpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKSB7XHJcblx0XHQgICAgQm9va3MuaW5pdCgpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSkge1xyXG5cdFx0ICAgICAgICAkc2NvcGUuYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpOyAgICAgICAgICBcclxuXHRcdCAgICB9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCRzY29wZS5ib29rcyA9IEJvb2tzLmdldEFsbEJvb2tzKCk7XHJcblx0XHR9XHJcbiAgICAgICAgXHJcbiAgICAgICAgJHNjb3BlLnNob3dTaG9ydEluZm8gPSBCdXR0b25zLnNob3dTaG9ydEluZm87XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcigncmFuZG9tUXVvdGVDb250cm9sbGVyJywgWydCb29rcycsICckcm91dGVQYXJhbXMnLCBmdW5jdGlvbiAoQm9va3MsICRyb3V0ZVBhcmFtcykge1xyXG4gICAgICAgIHZhciBjb250cm9sbGVyID0gdGhpcztcclxuICAgICAgICBjb250cm9sbGVyLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIucXVvdGVzQW1vdW50ID0gY29udHJvbGxlci5ib29rLnF1b3Rlc0Ftb3VudDtcclxuICAgICAgICBjb250cm9sbGVyLnF1b3RlcyA9IFtdO1xyXG4gICAgICAgIGNvbnRyb2xsZXIucmFuZG9tUXVvdGUgPSAna2FrYSc7XHJcblxyXG4gICAgICAgIGNvbnRyb2xsZXIuYm9vay5hYnN0cmFjdEl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ3F1b3RlJykge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5xdW90ZXMucHVzaChpdGVtLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnRyb2xsZXIuY2hvb3NlUmFuZG9tUXVvdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbnRyb2xsZXIucXVvdGVzQW1vdW50KTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5yYW5kb21RdW90ZSA9IGNvbnRyb2xsZXIucXVvdGVzW3JhbmRvbUluZGV4XTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnRyb2xsZXIuY2hvb3NlUmFuZG9tUXVvdGUoKTtcclxuICAgICAgICBzZXRJbnRlcnZhbChjb250cm9sbGVyLmNob29zZVJhbmRvbVF1b3RlLCAxMDAwKTtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuY29udHJvbGxlcignU2VhcmNoQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRodHRwJywgJ0Jvb2tzJywgJ0Jvb2snLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgQm9va3MsIEJvb2spIHtcclxuXHQkc2NvcGUuYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpO1xyXG5cdCRzY29wZS5zdWJtaXRTZWFyY2ggPSBmdW5jdGlvbiAoZm9ybSkge1xyXG5cdFx0aWYgKGZvcm0uJHZhbGlkKSB7XHJcblx0XHRcdHZhciB1cmw7XHJcblx0XHRcdCRzY29wZS50ZW1wQm9va3MgPSBbXTtcclxuXHRcdFx0JHNjb3BlLmluZGljZXNBZGRlZCA9IFtdO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCRzY29wZS5zZWFyY2hQYXJhbS5ieVRlcm0gPT0gXCJhbGxcIil7XHJcblx0XHRcdFx0dXJsID0gXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9ib29rcy92MS92b2x1bWVzP3E9XCIrJHNjb3BlLnNlYXJjaFBhcmFtLnRleHQrXCImbWF4UmVzdWx0cz0yMFwiO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHVybCA9IFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYm9va3MvdjEvdm9sdW1lcz9xPVwiKyRzY29wZS5zZWFyY2hQYXJhbS5ieVRlcm0rXCI6XCIrJHNjb3BlLnNlYXJjaFBhcmFtLnRleHQrXCImbWF4UmVzdWx0cz0yMFwiO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRodHRwLmdldCh1cmwpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0aWYgKHJlc3BvbnNlLnRvdGFsSXRlbXMgPiAwKXtcclxuXHRcdFx0XHRcdHZhciBlbG0sIG9iaiwgYXBwQm9va3MgPSByZXNwb25zZS5pdGVtcztcclxuXHRcdFx0XHRcdGZvciAodmFyIHByb3BlcnR5IGluIGFwcEJvb2tzKSB7XHJcblx0XHRcdFx0XHRcdGVsbSA9IGFwcEJvb2tzW3Byb3BlcnR5XTtcclxuXHRcdFx0XHRcdFx0b2JqID0ge1xyXG5cdFx0XHRcdFx0XHRcdGlkOiBlbG0uaWQsXHJcblx0XHRcdFx0XHRcdFx0dGl0bGU6IGVsbS52b2x1bWVJbmZvLnRpdGxlLFxyXG5cdFx0XHRcdFx0XHRcdGF1dGhvcjogZWxtLnZvbHVtZUluZm8uYXV0aG9yc3x8XCJcIixcclxuXHRcdFx0XHRcdFx0XHRpbWFnZTogZWxtLnZvbHVtZUluZm8uaW1hZ2VMaW5rcyA/IGVsbS52b2x1bWVJbmZvLmltYWdlTGlua3MudGh1bWJuYWlsIDogQm9va3MuZGVmYXVsdGNvdmVyLFxyXG5cdFx0XHRcdFx0XHRcdHB1Ymxpc2hlcjogZWxtLnZvbHVtZUluZm8ucHVibGlzaGVyLFxyXG5cdFx0XHRcdFx0XHRcdHB1YmxpY2F0aW9uRGF0ZTogZWxtLnZvbHVtZUluZm8ucHVibGlzaGVkRGF0ZSxcclxuXHRcdFx0XHRcdFx0XHRjYXRlZ29yeTogZWxtLnZvbHVtZUluZm8uY2F0ZWdvcmllcyxcclxuXHRcdFx0XHRcdFx0XHRsZW5ndGg6IGVsbS52b2x1bWVJbmZvLnBhZ2VDb3VudCxcclxuXHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogZWxtLnZvbHVtZUluZm8uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0aXNBZGRlZCA6IGZhbHNlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKEJvb2tzLmdldEJvb2tCeUlEKGVsbS5pZCkpe1xyXG5cdFx0XHRcdFx0XHRcdG9iai5pc0FkZGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQkc2NvcGUudGVtcEJvb2tzLnB1c2gob2JqKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdCRzY29wZS5hZGRCb29rID0gZnVuY3Rpb24oaW5kZXgsIGJvb2spIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnRlbXBCb29rc1tpbmRleF0uaXNBZGRlZCA9IHRydWU7ICBcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHR2YXIgbmV3Qm9vayA9IG5ldyBCb29rKGJvb2spO1xyXG5cdFx0XHRcdFx0XHRuZXdCb29rLnNhdmUoKTtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmJvb2tzID0gQm9va3MuZ2V0QWxsQm9va3MoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdCRzY29wZS5ub1Jlc3VsdHMgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0JHNjb3BlLm5vUmVzdWx0cyA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcbn1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5jb250cm9sbGVyKCdTdGF0aXN0aWNzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0Jvb2tzJywgJ0Jvb2snLCBmdW5jdGlvbiAoJHNjb3BlLCBCb29rcywgQm9vaykge1xyXG5cdHZhciBib29rcyA9IEJvb2tzLmdldEFsbEJvb2tzKCksXHJcblx0XHRzdW1RdW90ZXMgPSAwLFxyXG5cdFx0c3VtTm90ZXMgPSAwLFxyXG5cdFx0c3VtUmV2aWV3ID0gMCxcclxuXHRcdHN1bUJvb2tzUXVvdGVzID0gMCxcclxuXHRcdHN1bUJvb2tzTm90ZXMgPSAwLFxyXG5cdFx0YW1vdW50UGFnZXMgPSAwLFxyXG5cdFx0YXZhcmFnZVF1b3RlcyxcclxuXHRcdGF2YXJhZ2VOb3RlcztcclxuXHJcbiBcdGZ1bmN0aW9uIGdldFJhbmRvbShtaW4sbWF4KXtcclxuXHQgXHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuXHR9XHJcblxyXG5cdGFuZ3VsYXIuZm9yRWFjaChib29rcywgZnVuY3Rpb24gKG9iaikge1xyXG5cdFx0aWYgKG9iai5xdW90ZXNBbW91bnQpIHtcclxuXHRcdFx0c3VtQm9va3NRdW90ZXMrKztcclxuXHRcdFx0c3VtUXVvdGVzICs9IG9iai5xdW90ZXNBbW91bnQ7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmIChvYmoubm90ZXNBbW91bnQpIHtcclxuXHRcdFx0c3VtQm9va3NOb3RlcysrO1xyXG5cdFx0XHRzdW1Ob3RlcyArPSBvYmoubm90ZXNBbW91bnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG9iai5yZXZpZXcpe1xyXG5cdFx0XHRzdW1SZXZpZXcrKztcclxuXHRcdH1cclxuXHJcblx0XHRpZihvYmoubGVuZ3RoKXtcclxuXHRcdFx0YW1vdW50UGFnZXMgKz0gb2JqLmxlbmd0aDtcclxuXHRcdH1cdFxyXG5cdFx0b2JqLnN0eWxlID0ge1xyXG5cdFx0XHR3aWR0aCA6IGdldFJhbmRvbSg4MCwgOTApLFxyXG5cdFx0IFx0bGVmdDogZ2V0UmFuZG9tKC01LCAxMCksXHJcblx0XHQgXHRoZWlnaHQ6IGdldFJhbmRvbSgyMCwgNTApLFxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRhdmFyYWdlUXVvdGVzID0gcGFyc2VJbnQoIHN1bVF1b3RlcyAvIGJvb2tzLmxlbmd0aCk7XHJcblx0YXZhcmFnZU5vdGVzID0gcGFyc2VJbnQoIHN1bU5vdGVzIC8gYm9va3MubGVuZ3RoKTtcclxuXHJcblx0JHNjb3BlLnN0YXRpc3RpY3MgPSB7XHJcblx0XHRhbW91bnRCb29rczogYm9va3MubGVuZ3RoLFxyXG5cdFx0YXZhcmFnZU5vdGVzOiBhdmFyYWdlTm90ZXMsXHJcblx0XHRzdW1Cb29rc05vdGVzOiBzdW1Cb29rc05vdGVzLFxyXG5cdFx0YXZhcmFnZVF1b3RlczogYXZhcmFnZVF1b3RlcyxcdFx0XHJcblx0XHRzdW1Cb29rc1F1b3Rlczogc3VtQm9va3NRdW90ZXMsXHJcblx0XHRxdW90ZXNBbW91bnRBbGw6IHN1bVF1b3RlcyxcclxuXHRcdG5vdGVzQW1vdW50QWxsOiBzdW1Ob3RlcyxcclxuXHRcdHJldmlld0Ftb3VudEFsbDogc3VtUmV2aWV3XHRcclxuXHR9O1xyXG5cdCRzY29wZS5ib29rcyA9IGJvb2tzO1xyXG5cclxuXHQkc2NvcGUuYm9va3NIZWlnaHQgPSBwYXJzZUludChhbW91bnRQYWdlcyAqIDAuMDkgLyAxMCk7XHJcblxyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ2FkZENhbmNlbEJ0bicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL2FkZC1jYW5jZWwtYnRuLmh0bWwnXHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdhZGRlZE1vZGlmaWVkJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL2FkZGVkLW1vZGlmaWVkLXNlY3Rpb24uaHRtbCcsXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdib29rU2VhcmNoU2VjdGlvbicsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9ib29rLXNlYXJjaC1zZWN0aW9uLmh0bWwnLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnZGV0YWlsc0ZsYWdzJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL2RldGFpbHMtZmxhZ3MuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkcm91dGVQYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mb1VybDogJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvaW5mbycsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFVybDogJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvY29udGVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYWJzdHJhY3RVcmw6ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2Fic3RyYWN0J1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnZmxhZ3NDdHJsJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnZWRpdERlbGV0ZUJ0bicsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9lZGl0LWRlbGV0ZS1idG4uaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9va3MsIEJvb2spIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5kZWxldGVCb29rID0gZnVuY3Rpb24oKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgIGJvb2sgPSBuZXcgQm9vayhib29rKTtcclxuICAgICAgICAgICAgICAgICAgICAgYm9vay5kZWxldGUoKTsgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXRQYWdlVXJsOiAnIy9ib29rcy8nICsgJHJvdXRlUGFyYW1zLmlkICsgJy9lZGl0JyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGVQYWdlVXJsOiAnIy9ib29rcydcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2VkaXREZWxDdHJsJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnZmlsdGVyQWJzdHJhY3QnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvZmlsdGVyLWFic3RyLmh0bWwnLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnbWFpbk5hdicsIFsgJyRsb2NhdGlvbicsJyRyb290U2NvcGUnLCBmdW5jdGlvbigkbG9jYXRpb24sICRyb290c2NvcGUpe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvbWFpbi1uYXYuaHRtbCcsXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICAgICAgJHJvb3RzY29wZS5pc0FjdGl2ZUFzaWRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5vcGVuQXNpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkcm9vdHNjb3BlLmlzQWN0aXZlQXNpZGUgPSAhJHJvb3RzY29wZS5pc0FjdGl2ZUFzaWRlO1xyXG4gICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgIHNjb3BlLmlzQWN0aXZlID0gZnVuY3Rpb24gKHZpZXdMb2NhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmlld0xvY2F0aW9uID09PSAkbG9jYXRpb24ucGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgfTsgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnbW9kYWxCYWNrZHJvcCcsIFsgJyRsb2NhdGlvbicsJyRyb290U2NvcGUnLCBmdW5jdGlvbigkbG9jYXRpb24sICRyb290c2NvcGUpe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvbW9kYWwtYmFja2Ryb3AuaHRtbCcsXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgJHJvb3RzY29wZS5pc0FjdGl2ZUFzaWRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmNsb3NlQXNpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkcm9vdHNjb3BlLmlzQWN0aXZlQXNpZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ3F1aWNrU3RhdGlzdGljcycsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9xdWljay1zdGF0aXN0aWNzLmh0bWwnLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgncmFuZG9tUXVvdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9yYW5kb20tcXVvdGUuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdyYW5kb21RdW90ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdxdW90ZUN0cmwnXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ3NhdmVDYW5jZWxCdG4nLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvc2F2ZS1jYW5jZWwtYnRuLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHJvdXRlUGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tVcmw6ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2luZm8nXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdzYXZlQ2FuY2VsQ3RybCdcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ3N0YXRpc3RpY3NTZWN0aW9uJywgWydCb29rcycsIGZ1bmN0aW9uIChCb29rcykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvc3RhdGlzdGljcy1zZWN0aW9uLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmZpbHRlcignYWJzdHJhY3RGaWx0ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtcywgdHlwZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gW107XHJcblxyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaXRlbXMsIGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZXNUb1Nob3cucXVvdGVzICYmIHR5cGVzVG9TaG93Lm5vdGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXR5cGVzVG9TaG93LnF1b3RlcyAmJiB0eXBlc1RvU2hvdy5ub3RlcyAmJiBpdGVtLnR5cGUgPT09ICdub3RlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVzVG9TaG93LnF1b3RlcyAmJiAhdHlwZXNUb1Nob3cubm90ZXMgJiYgaXRlbS50eXBlID09PSAncXVvdGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQ7XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpLmZhY3RvcnkoJ0Jvb2snLCBmdW5jdGlvbiBCb29rRmFjdG9yeSgpIHtcclxuXHJcbiAgICB2YXIgQm9va0ZhY3RvcnkgPSBmdW5jdGlvbiAob2JqKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBvYmouaWQ7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IG9iai50aXRsZSB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZiAob2JqLmF1dGhvcikge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KG9iai5hdXRob3IpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhvciA9IG9iai5hdXRob3Iuam9pbignLCAnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aG9yID0gb2JqLmF1dGhvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aG9yID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBvYmouaW1hZ2UgfHwgbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKG9iai5jYXRlZ29yeSkge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KG9iai5jYXRlZ29yeSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBvYmouY2F0ZWdvcnkuam9pbignLCAnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBvYmouY2F0ZWdvcnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNhdGVnb3J5ID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucHVibGlzaGVyID0gb2JqLnB1Ymxpc2hlciB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMucHVibGljYXRpb25EYXRlID0gb2JqLnB1YmxpY2F0aW9uRGF0ZSB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gb2JqLmxlbmd0aCB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMucmF0ZSA9IG9iai5yYXRlIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IG9iai5kZXNjcmlwdGlvbiB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMucmV2aWV3ID0gb2JqLnJldmlldyB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuYWJzdHJhY3RJdGVtcyA9IG9iai5hYnN0cmFjdEl0ZW1zIHx8IFtdO1xyXG4gICAgICAgIHRoaXMucXVvdGVzQW1vdW50ID0gb2JqLnF1b3Rlc0Ftb3VudCB8fCAwO1xyXG4gICAgICAgIHRoaXMubm90ZXNBbW91bnQgPSBvYmoubm90ZXNBbW91bnQgfHwgMDtcclxuXHJcbiAgICAgICAgaWYgKCFvYmouYWRkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRlZCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm1vZGlmaWVkID0gb2JqLm1vZGlmaWVkIHx8IG5ldyBEYXRlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBjdXJyZW50Qm9va3MgPSBbXTtcclxuXHJcbiAgICBCb29rRmFjdG9yeS5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpIHtcclxuICAgICAgICAgICAgY3VycmVudEJvb2tzID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRCb29rcy5wdXNoKHRoaXMpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdib29rcycsIGFuZ3VsYXIudG9Kc29uKGN1cnJlbnRCb29rcykpO1xyXG4gICAgfTtcclxuXHJcbiAgICBCb29rRmFjdG9yeS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgICAgaXNOZXcgPSB0cnVlO1xyXG4gICAgICAgIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpIHtcclxuICAgICAgICAgICAgdGhhdC5zYXZlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3VycmVudEJvb2tzID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChjdXJyZW50Qm9va3MsIGZ1bmN0aW9uIChvYmosIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLmlkID09IHRoYXQuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godGhhdCwgZnVuY3Rpb24gKHZhbHVlLCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcGVydHldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jvb2tzJywgYW5ndWxhci50b0pzb24oY3VycmVudEJvb2tzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNOZXcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChpc05ldykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5zYXZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIEJvb2tGYWN0b3J5LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgICBjdXJyZW50Qm9va3MgPSBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGN1cnJlbnRCb29rcywgZnVuY3Rpb24gKG9iaiwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmouaWQgPT0gdGhhdC5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCb29rcy5zcGxpY2UoaW5kZXgsIDEpOyBcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYm9va3MnLCBhbmd1bGFyLnRvSnNvbihjdXJyZW50Qm9va3MpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBCb29rRmFjdG9yeTtcclxufSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuZmFjdG9yeSgnQm9va3MnLCBmdW5jdGlvbiBCb29rc0ZhY3RvcnkoJGh0dHAsIEJvb2spIHtcclxuICAgIHZhciBmYWN0b3J5ID0ge307XHJcbiAgICBmYWN0b3J5LmRlZmF1bHRjb3ZlciA9IFwiaW1hZ2VzL1RoZV9Cb29rXyhGcm9udF9Db3ZlcikuanBnXCI7XHJcbiAgICBmYWN0b3J5LmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9ib29rcy92MS91c2Vycy8xMTQ4NzMyMjkyNDAzMzYzNTAxMzQvYm9va3NoZWx2ZXMvMC92b2x1bWVzXCIpO1xyXG4gICAgICAgIHByb21pc2Uuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdmFyIGJvb2ssIGVsbSwgb2JqLCBhcHBCb29rcyA9IHJlc3BvbnNlLml0ZW1zO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBhcHBCb29rcykge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gYXBwQm9va3NbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgb2JqID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBlbG0uaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGVsbS52b2x1bWVJbmZvLnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvcjogZWxtLnZvbHVtZUluZm8uYXV0aG9ycyxcclxuICAgICAgICAgICAgICAgICAgICBwdWJsaXNoZXI6IGVsbS52b2x1bWVJbmZvLnB1Ymxpc2hlcixcclxuICAgICAgICAgICAgICAgICAgICBwdWJsaWNhdGlvbkRhdGU6IGVsbS52b2x1bWVJbmZvLnB1Ymxpc2hlZERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGVsbS52b2x1bWVJbmZvLmltYWdlTGlua3MudGh1bWJuYWlsLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBlbG0udm9sdW1lSW5mby5jYXRlZ29yaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aDogZWxtLnZvbHVtZUluZm8ucGFnZUNvdW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBlbG0udm9sdW1lSW5mby5kZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYm9vayA9IG5ldyBCb29rKG9iaik7XHJcbiAgICAgICAgICAgICAgICBib29rLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGZhY3RvcnkuZ2V0QWxsQm9va3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgfTtcclxuICAgIGZhY3RvcnkuZ2V0Qm9va0J5SUQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICB2YXIgYm9va3MgPSBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvb2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChib29rc1tpXS5pZCA9PT0gaWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBib29rc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGZhY3Rvcnk7XHJcbn0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZmFjdG9yeSgnQnV0dG9ucycsIGZ1bmN0aW9uIEJ1dHRvbnNGYWN0b3J5KCkge1xyXG5cclxuICAgICAgICByZXR1cm4gQnV0dG9ucyA9IHtcclxuICAgICAgICAgICAgdG9nZ2xlVXJsQnRuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGlucHV0ID0gJCgnI2ltYWdlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgJGJveCA9ICQoJy5jb3Zlci1ib3gnKSxcclxuICAgICAgICAgICAgICAgICAgICAkbWVzc2FnZSA9ICRib3guZmluZCgnc3BhbicpO1xyXG5cclxuICAgICAgICAgICAgICAgICRpbnB1dC5zaG93KCkuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICRtZXNzYWdlLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICRpbnB1dC5vbignZm9jdXNvdXQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkaW5wdXQudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG1lc3NhZ2UuaHRtbCgnYWRkIGNvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG1lc3NhZ2UuaHRtbCgnY2hhbmdlIGNvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICRtZXNzYWdlLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAkaW5wdXQuaGlkZSgpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNob3dTaG9ydEluZm86IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICRidG4gPSAkKGUudGFyZ2V0KSxcclxuICAgICAgICAgICAgICAgICAgICAkYm9vayA9ICRidG4uY2xvc2VzdCgnLmJvb2staW5zdGFuY2UnKSxcclxuICAgICAgICAgICAgICAgICAgICAkYm94ID0gJGJ0bi5jbG9zZXN0KCcuYm9vay1pbnN0YW5jZScpLmZpbmQoJy5tb3JlLWluZm8tYm94Jyk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICRib3gudG9nZ2xlQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgICAgICAgICAgICAgJGJvb2sub24oJ2ZvY3Vzb3V0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdqZW9ld29qZXdvZXdvZXdpb3dyaW8nKTtcclxuICAgICAgICAgICAgICAgICAgICAkYm94LnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zY3JpcHRzIn0=