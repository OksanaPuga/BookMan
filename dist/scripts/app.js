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
	$scope.submitSearch = function (form) {
		if (form.$valid) {
			var url;
			$scope.tempBooks = [];
			
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
							author: angular.isArray(elm.volumeInfo.authors) ? elm.volumeInfo.authors.join(', ') : elm.volumeInfo.authors || "",        
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWJzdHJhY3QtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWRkLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rLWNvbnRlbnQtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stZWRpdC1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYm9vay1pbmZvLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rcy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcmFuZG9tLXF1b3Rlcy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvc2VhcmNoLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9zdGF0aXN0aWNzLWNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL2FkZC1jYW5jZWwtYnRuLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvYWRkZWQtbW9kaWZpZWQtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9ib29rLXNlYXJjaC1zZWN0aW9uLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvZGV0YWlscy1mbGFncy1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL2VkaXQtZGVsZXRlLWJ0bi1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL2ZpbHRlci1hYnN0cmFjdC1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL21haW4tbmF2LWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvbW9kYWwtYmFja2Ryb3AtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9xdWljay1zdGF0aXN0aWNzLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvcmFuZG9tLXF1b3RlLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvc2F2ZS1jYW5jZWwtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9zdGF0aXN0aWNzLXNlY3Rpb24tZGlyZWN0aXZlLmpzIiwiZmlsdGVycy9hYnN0cmFjdC1maWx0ZXIuanMiLCJzZXJ2aWNlcy9ib29rLWZhY3RvcnkuanMiLCJzZXJ2aWNlcy9ib29rcy1mYWN0b3J5LmpzIiwic2VydmljZXMvYnV0dG9ucy1mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nLCBbJ25nUm91dGUnXSkuY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvYm9va3MnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Jvb2tzJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9pbmRleC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tzQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tzQ3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvc2VhcmNoJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9zZWFyY2gvaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZWFyY2hDb250cm9sbGVyJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9zdGF0aXN0aWNzJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9zdGF0aXN0aWNzL2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU3RhdGlzdGljc0NvbnRyb2xsZXInXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Fib3V0Jywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9hYm91dC9pbmRleC5odG1sJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9hZGQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2FkZC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tBZGRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va0FkZEN0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Jvb2tzLzppZC9pbmZvJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9kZXRhaWxzL2luZm8uaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rSW5mb0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rSW5mb0N0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Jvb2tzLzppZC9hYnN0cmFjdCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZGV0YWlscy9hYnN0cmFjdC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tBYnN0cmFjdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rQWJzdHJDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvY29udGVudCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZGV0YWlscy9jb250ZW50Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va0NvbnRlbnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va0NvbnRDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvZWRpdCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZWRpdC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tFZGl0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tFZGl0Q3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vdGhlcndpc2Uoe1xyXG4gICAgICAgICAgICByZWRpcmVjdFRvOiAnL2Jvb2tzJ1xyXG4gICAgICAgIH0pXHJcbn1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tBYnN0cmFjdENvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQm9vaycsICdCb29rcycsIGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9vaywgQm9va3MpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG4gICAgICAgICRzY29wZS5jdXJyZW50VGFiID0gJ2Fic3RyJztcclxuXHJcbiAgICAgICAgJHNjb3BlLnR5cGVzVG9TaG93ID0ge1xyXG4gICAgICAgICAgICBxdW90ZXM6IHRydWUsXHJcbiAgICAgICAgICAgIG5vdGVzOiB0cnVlLFxyXG4gICAgICAgICAgICByZXZpZXc6IHRydWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZCA9IHtcclxuICAgICAgICAgICAgdHlwZTogJ3F1b3RlJyxcclxuICAgICAgICAgICAgY29udGVudDogJycsXHJcbiAgICAgICAgICAgIGluZGV4OiBudWxsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzQ3VycmVudCA9IGZ1bmN0aW9uICh0YWIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5jdXJyZW50VGFiID09PSB0YWI7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgICRzY29wZS5pbmNyZWFzZU5vdGVzQW1vdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5ub3Rlc0Ftb3VudCsrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHNjb3BlLmluY3JlYXNlUXVvdGVzQW1vdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5xdW90ZXNBbW91bnQrKztcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS5kZWNyZWFzZU5vdGVzQW1vdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5ub3Rlc0Ftb3VudC0tO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHNjb3BlLmRlY3JlYXNlUXVvdGVzQW1vdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5xdW90ZXNBbW91bnQtLTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUuc2hvd0FsbEFic3RyYWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUudHlwZXNUb1Nob3cgPSB7XHJcbiAgICAgICAgICAgICAgICBxdW90ZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBub3RlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJldmlldzogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZ2dsZUJ1dHRvbnMgPSBmdW5jdGlvbiAoJGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkZXZlbnQuY3VycmVudFRhcmdldDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIGlmICghJCh0YXJnZXQpLmhhc0NsYXNzKCdvcGVuZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnYXJ0aWNsZScpLnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkKHRhcmdldCkudG9nZ2xlQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUudXBkYXRlQm9va0Fic3RyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5tb2RpZmllZCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Ym9vayA9IG5ldyBCb29rKCRzY29wZS5ib29rKTtcclxuICAgICAgICAgICAgY3VycmVudGJvb2sudXBkYXRlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmFkZEFic3RySXRlbSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBlZGl0ZWRJdGVtID0gJHNjb3BlLmFic3RySXRlbVRvQWRkLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudEl0ZW0gPSAkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zWyRzY29wZS5hYnN0ckl0ZW1Ub0FkZC5pbmRleF07XHJcblxyXG4gICAgICAgICAgICBpZiAoZWRpdGVkSXRlbS5jb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWRpdGVkSXRlbS5pbmRleCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlZGl0ZWRJdGVtLnR5cGUgPT09ICdyZXZpZXcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5ib29rLnJldmlldyA9IGVkaXRlZEl0ZW0uY29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zLnB1c2goZWRpdGVkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlZGl0ZWRJdGVtLnR5cGUgPT09ICdxdW90ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmNyZWFzZVF1b3Rlc0Ftb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmluY3JlYXNlTm90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRJdGVtLnR5cGUgPT09ICdub3RlJyAmJiBlZGl0ZWRJdGVtLnR5cGUgPT09ICdxdW90ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRlY3JlYXNlTm90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmluY3JlYXNlUXVvdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50SXRlbS50eXBlID09PSAncXVvdGUnICYmIGVkaXRlZEl0ZW0udHlwZSA9PT0gJ25vdGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kZWNyZWFzZVF1b3Rlc0Ftb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5jcmVhc2VOb3Rlc0Ftb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWRpdGVkSXRlbS50eXBlID09PSAncmV2aWV3Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYm9vay5yZXZpZXcgPSBlZGl0ZWRJdGVtLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kZWxldGVBYnN0ckl0ZW0oZWRpdGVkSXRlbS5pbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdxdW90ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEl0ZW0uY29udGVudCA9IGVkaXRlZEl0ZW0uY29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SXRlbS50eXBlID0gZWRpdGVkSXRlbS50eXBlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdxdW90ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IG51bGxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUJvb2tBYnN0cigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmVkaXRBYnN0ckl0ZW0gPSBmdW5jdGlvbiAoJGluZGV4KSB7XHJcbiAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZC50eXBlID0gJHNjb3BlLmJvb2suYWJzdHJhY3RJdGVtc1skaW5kZXhdLnR5cGU7XHJcbiAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZC5jb250ZW50ID0gJHNjb3BlLmJvb2suYWJzdHJhY3RJdGVtc1skaW5kZXhdLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICRzY29wZS5hYnN0ckl0ZW1Ub0FkZC5pbmRleCA9ICRpbmRleDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLDApO1xyXG4gICAgICAgICAgICAkKCd0ZXh0YXJlYScpLmZvY3VzKCk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlQm9va0Fic3RyKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmRlbGV0ZUFic3RySXRlbSA9IGZ1bmN0aW9uICgkaW5kZXgpIHtcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5ib29rLmFic3RyYWN0SXRlbXNbJGluZGV4XS50eXBlID09PSAncXVvdGUnKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGVjcmVhc2VRdW90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zWyRpbmRleF0udHlwZSA9PT0gJ25vdGUnKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGVjcmVhc2VOb3Rlc0Ftb3VudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXMuc3BsaWNlKFskaW5kZXhdLCAxKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVCb29rQWJzdHIoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuZWRpdFJldmlldyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkLnR5cGUgPSAncmV2aWV3JztcclxuICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkLmNvbnRlbnQgPSAkc2NvcGUuYm9vay5yZXZpZXc7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKTtcclxuICAgICAgICAgICAgJCgndGV4dGFyZWEnKS5mb2N1cygpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUJvb2tBYnN0cigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5kZWxldGVSZXZpZXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLnJldmlldyA9IG51bGw7XHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVCb29rQWJzdHIoKTtcclxuICAgICAgICB9O1xyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rQWRkQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0Jvb2snLCAnQm9va3MnLCAnQnV0dG9ucycsIGZ1bmN0aW9uICgkc2NvcGUsIEJvb2ssIEJvb2tzLCBCdXR0b25zKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5nZW5lcmF0ZUlkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcmFuZG9tSWQgPSAnJztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByYW5kb21JZCArPSBNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSAqIDkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByYW5kb21JZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5ib29rID0ge307XHJcblxyXG4gICAgICAgICRzY29wZS5hZGRCb29rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmJvb2sucmF0ZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmJvb2sucmF0ZSA9IFsnMSBzdGFyJywgJzIgc3RhcnMnLCAnMyBzdGFycycsICc0IHN0YXJzJywgJzUgc3RhcnMnXS5zbGljZSgwLCAkc2NvcGUuYm9vay5yYXRlKTtcclxuICAgICAgICAgICAgICAgIC8vIGZvciBpdGVyYXRpbmcgcmF0ZS1zdGFyc1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGxvb2tzIHByZXR0eSBzdHJhbmdlLCBidXQgaXQgaXMgdGhlIGVhc2llc3QgaGVscGVyIGZvciBuZy1yZXBlYXQgd2hpY2ggSSd2ZSBkaXNjb3ZlcmVkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHNjb3BlLmJvb2suaWQgPSAkc2NvcGUuZ2VuZXJhdGVJZCgpO1xyXG4gICAgICAgICAgICBuZXcgQm9vaygkc2NvcGUuYm9vaykuc2F2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZ2dsZVVybEJ0biA9IEJ1dHRvbnMudG9nZ2xlVXJsQnRuO1xyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tDb250ZW50Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdCb29rJywgJ0Jvb2tzJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBCb29rLCBCb29rcykge1xyXG5cclxuICAgICAgICAkc2NvcGUuYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRUYWIgPSAnY29udCc7XHJcblxyXG4gICAgICAgICRzY29wZS5pc0N1cnJlbnQgPSBmdW5jdGlvbiAodGFiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuY3VycmVudFRhYiA9PT0gdGFiO1xyXG4gICAgICAgIH1cclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcignQm9va0VkaXRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ0Jvb2snLCAnQm9va3MnLCAnQnV0dG9ucycsIGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9vaywgQm9va3MsIEJ1dHRvbnMpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG5cclxuICAgICAgICAkc2NvcGUuZWRpdGVkQm9va0luZm8gPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBwYXJhbSBpbiAkc2NvcGUuYm9vaykge1xyXG4gICAgICAgICAgICAkc2NvcGUuZWRpdGVkQm9va0luZm9bcGFyYW1dID0gJHNjb3BlLmJvb2tbcGFyYW1dO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheSgkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSkpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnJhdGUgPSAkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuc2F2ZUNoYW5nZXMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnJhdGUpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5lZGl0ZWRCb29rSW5mby5yYXRlID0gWycxIHN0YXInLCAnMiBzdGFycycsICczIHN0YXJzJywgJzQgc3RhcnMnLCAnNSBzdGFycyddLnNsaWNlKDAsICRzY29wZS5lZGl0ZWRCb29rSW5mby5yYXRlKTtcclxuICAgICAgICAgICAgICAgIC8vIGZvciBpdGVyYXRpbmcgcmF0ZS1zdGFyc1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGxvb2tzIHByZXR0eSBzdHJhbmdlLCBidXQgaXQgaXMgdGhlIGVhc2llc3QgaGVscGVyIGZvciBuZy1yZXBlYXQgd2hpY2ggSSd2ZSBkaXNjb3ZlcmVkXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHBhcmFtIGluICRzY29wZS5lZGl0ZWRCb29rSW5mbykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmJvb2tbcGFyYW1dID0gJHNjb3BlLmVkaXRlZEJvb2tJbmZvW3BhcmFtXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmJvb2subW9kaWZpZWQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBuZXcgQm9vaygkc2NvcGUuYm9vaykudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICRzY29wZS50b2dnbGVVcmxCdG4gPSBCdXR0b25zLnRvZ2dsZVVybEJ0bjtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rSW5mb0NvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQm9vaycsICdCb29rcycsIGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9vaywgQm9va3MpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG4gICAgICAgICRzY29wZS5jdXJyZW50VGFiID0gJ2luZm8nO1xyXG5cclxuICAgICAgICAkc2NvcGUuaXNDdXJyZW50ID0gZnVuY3Rpb24gKHRhYikge1xyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLmN1cnJlbnRUYWIgPT09IHRhYjtcclxuICAgICAgICB9XHJcblxyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rc0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdCb29rcycsICdCb29rJywgJ0J1dHRvbnMnLCBmdW5jdGlvbiAoJHNjb3BlLCBCb29rcywgQm9vaywgQnV0dG9ucykge1xyXG5cclxuXHRcdGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpIHtcclxuXHRcdCAgICBCb29rcy5pbml0KCkudGhlbihmdW5jdGlvbihwcm9taXNlKSB7XHJcblx0XHQgICAgICAgICRzY29wZS5ib29rcyA9IEJvb2tzLmdldEFsbEJvb2tzKCk7ICAgICAgICAgIFxyXG5cdFx0ICAgIH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JHNjb3BlLmJvb2tzID0gQm9va3MuZ2V0QWxsQm9va3MoKTtcclxuXHRcdH1cclxuICAgICAgICBcclxuICAgICAgICAkc2NvcGUuc2hvd1Nob3J0SW5mbyA9IEJ1dHRvbnMuc2hvd1Nob3J0SW5mbztcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdyYW5kb21RdW90ZUNvbnRyb2xsZXInLCBbJ0Jvb2tzJywgJyRyb3V0ZVBhcmFtcycsIGZ1bmN0aW9uIChCb29rcywgJHJvdXRlUGFyYW1zKSB7XHJcbiAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSB0aGlzO1xyXG4gICAgICAgIGNvbnRyb2xsZXIuYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgY29udHJvbGxlci5xdW90ZXNBbW91bnQgPSBjb250cm9sbGVyLmJvb2sucXVvdGVzQW1vdW50O1xyXG4gICAgICAgIGNvbnRyb2xsZXIucXVvdGVzID0gW107XHJcbiAgICAgICAgY29udHJvbGxlci5yYW5kb21RdW90ZSA9ICdrYWthJztcclxuXHJcbiAgICAgICAgY29udHJvbGxlci5ib29rLmFic3RyYWN0SXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSAncXVvdGUnKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLnF1b3Rlcy5wdXNoKGl0ZW0uY29udGVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29udHJvbGxlci5jaG9vc2VSYW5kb21RdW90ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29udHJvbGxlci5xdW90ZXNBbW91bnQpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLnJhbmRvbVF1b3RlID0gY29udHJvbGxlci5xdW90ZXNbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29udHJvbGxlci5jaG9vc2VSYW5kb21RdW90ZSgpO1xyXG4gICAgICAgIHNldEludGVydmFsKGNvbnRyb2xsZXIuY2hvb3NlUmFuZG9tUXVvdGUsIDEwMDApO1xyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5jb250cm9sbGVyKCdTZWFyY2hDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGh0dHAnLCAnQm9va3MnLCAnQm9vaycsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCBCb29rcywgQm9vaykge1xyXG5cdCRzY29wZS5zdWJtaXRTZWFyY2ggPSBmdW5jdGlvbiAoZm9ybSkge1xyXG5cdFx0aWYgKGZvcm0uJHZhbGlkKSB7XHJcblx0XHRcdHZhciB1cmw7XHJcblx0XHRcdCRzY29wZS50ZW1wQm9va3MgPSBbXTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICgkc2NvcGUuc2VhcmNoUGFyYW0uYnlUZXJtID09IFwiYWxsXCIpe1xyXG5cdFx0XHRcdHVybCA9IFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYm9va3MvdjEvdm9sdW1lcz9xPVwiKyRzY29wZS5zZWFyY2hQYXJhbS50ZXh0K1wiJm1heFJlc3VsdHM9MjBcIjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR1cmwgPSBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2Jvb2tzL3YxL3ZvbHVtZXM/cT1cIiskc2NvcGUuc2VhcmNoUGFyYW0uYnlUZXJtK1wiOlwiKyRzY29wZS5zZWFyY2hQYXJhbS50ZXh0K1wiJm1heFJlc3VsdHM9MjBcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHQkaHR0cC5nZXQodXJsKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGlmIChyZXNwb25zZS50b3RhbEl0ZW1zID4gMCl7XHJcblx0XHRcdFx0XHR2YXIgZWxtLCBvYmosIGFwcEJvb2tzID0gcmVzcG9uc2UuaXRlbXM7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBwcm9wZXJ0eSBpbiBhcHBCb29rcykge1xyXG5cdFx0XHRcdFx0XHRlbG0gPSBhcHBCb29rc1twcm9wZXJ0eV07XHJcblx0XHRcdFx0XHRcdG9iaiA9IHtcclxuXHRcdFx0XHRcdFx0XHRpZDogZWxtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdHRpdGxlOiBlbG0udm9sdW1lSW5mby50aXRsZSxcclxuXHRcdFx0XHRcdFx0XHRhdXRob3I6IGFuZ3VsYXIuaXNBcnJheShlbG0udm9sdW1lSW5mby5hdXRob3JzKSA/IGVsbS52b2x1bWVJbmZvLmF1dGhvcnMuam9pbignLCAnKSA6IGVsbS52b2x1bWVJbmZvLmF1dGhvcnMgfHwgXCJcIiwgICAgICAgIFxyXG5cdFx0XHRcdFx0XHRcdGltYWdlOiBlbG0udm9sdW1lSW5mby5pbWFnZUxpbmtzID8gZWxtLnZvbHVtZUluZm8uaW1hZ2VMaW5rcy50aHVtYm5haWwgOiBCb29rcy5kZWZhdWx0Y292ZXIsXHJcblx0XHRcdFx0XHRcdFx0cHVibGlzaGVyOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZXIsXHJcblx0XHRcdFx0XHRcdFx0cHVibGljYXRpb25EYXRlOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZWREYXRlLFxyXG5cdFx0XHRcdFx0XHRcdGNhdGVnb3J5OiBlbG0udm9sdW1lSW5mby5jYXRlZ29yaWVzLFxyXG5cdFx0XHRcdFx0XHRcdGxlbmd0aDogZWxtLnZvbHVtZUluZm8ucGFnZUNvdW50LFxyXG5cdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBlbG0udm9sdW1lSW5mby5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRpc0FkZGVkIDogZmFsc2VcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoQm9va3MuZ2V0Qm9va0J5SUQoZWxtLmlkKSl7XHJcblx0XHRcdFx0XHRcdFx0b2JqLmlzQWRkZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCRzY29wZS50ZW1wQm9va3MucHVzaChvYmopO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0JHNjb3BlLmFkZEJvb2sgPSBmdW5jdGlvbihpbmRleCwgYm9vaykge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudGVtcEJvb2tzW2luZGV4XS5pc0FkZGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0dmFyIG5ld0Jvb2sgPSBuZXcgQm9vayhib29rKTtcclxuXHRcdFx0XHRcdFx0bmV3Qm9vay5zYXZlKCk7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5ib29rcyA9IEJvb2tzLmdldEFsbEJvb2tzKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkc2NvcGUubm9SZXN1bHRzID0gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdCRzY29wZS5ub1Jlc3VsdHMgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG59XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJykuY29udHJvbGxlcignU3RhdGlzdGljc0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdCb29rcycsICdCb29rJywgZnVuY3Rpb24gKCRzY29wZSwgQm9va3MsIEJvb2spIHtcclxuXHR2YXIgYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpLFxyXG5cdFx0c3VtUXVvdGVzID0gMCxcclxuXHRcdHN1bU5vdGVzID0gMCxcclxuXHRcdHN1bVJldmlldyA9IDAsXHJcblx0XHRzdW1Cb29rc1F1b3RlcyA9IDAsXHJcblx0XHRzdW1Cb29rc05vdGVzID0gMCxcclxuXHRcdGFtb3VudFBhZ2VzID0gMCxcclxuXHRcdGF2YXJhZ2VRdW90ZXMsXHJcblx0XHRhdmFyYWdlTm90ZXM7XHJcblxyXG4gXHRmdW5jdGlvbiBnZXRSYW5kb20obWluLG1heCl7XHJcblx0IFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcblx0fVxyXG5cclxuXHRhbmd1bGFyLmZvckVhY2goYm9va3MsIGZ1bmN0aW9uIChvYmopIHtcclxuXHRcdGlmIChvYmoucXVvdGVzQW1vdW50KSB7XHJcblx0XHRcdHN1bUJvb2tzUXVvdGVzKys7XHJcblx0XHRcdHN1bVF1b3RlcyArPSBvYmoucXVvdGVzQW1vdW50O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAob2JqLm5vdGVzQW1vdW50KSB7XHJcblx0XHRcdHN1bUJvb2tzTm90ZXMrKztcclxuXHRcdFx0c3VtTm90ZXMgKz0gb2JqLm5vdGVzQW1vdW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChvYmoucmV2aWV3KXtcclxuXHRcdFx0c3VtUmV2aWV3Kys7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYob2JqLmxlbmd0aCl7XHJcblx0XHRcdGFtb3VudFBhZ2VzICs9IG9iai5sZW5ndGg7XHJcblx0XHR9XHRcclxuXHRcdG9iai5zdHlsZSA9IHtcclxuXHRcdFx0d2lkdGggOiBnZXRSYW5kb20oODAsIDkwKSxcclxuXHRcdCBcdGxlZnQ6IGdldFJhbmRvbSgtNSwgMTApLFxyXG5cdFx0IFx0aGVpZ2h0OiBnZXRSYW5kb20oMjAsIDUwKSxcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0YXZhcmFnZVF1b3RlcyA9IHBhcnNlSW50KCBzdW1RdW90ZXMgLyBib29rcy5sZW5ndGgpO1xyXG5cdGF2YXJhZ2VOb3RlcyA9IHBhcnNlSW50KCBzdW1Ob3RlcyAvIGJvb2tzLmxlbmd0aCk7XHJcblxyXG5cdCRzY29wZS5zdGF0aXN0aWNzID0ge1xyXG5cdFx0YW1vdW50Qm9va3M6IGJvb2tzLmxlbmd0aCxcclxuXHRcdGF2YXJhZ2VOb3RlczogYXZhcmFnZU5vdGVzLFxyXG5cdFx0c3VtQm9va3NOb3Rlczogc3VtQm9va3NOb3RlcyxcclxuXHRcdGF2YXJhZ2VRdW90ZXM6IGF2YXJhZ2VRdW90ZXMsXHRcdFxyXG5cdFx0c3VtQm9va3NRdW90ZXM6IHN1bUJvb2tzUXVvdGVzLFxyXG5cdFx0cXVvdGVzQW1vdW50QWxsOiBzdW1RdW90ZXMsXHJcblx0XHRub3Rlc0Ftb3VudEFsbDogc3VtTm90ZXMsXHJcblx0XHRyZXZpZXdBbW91bnRBbGw6IHN1bVJldmlld1x0XHJcblx0fTtcclxuXHQkc2NvcGUuYm9va3MgPSBib29rcztcclxuXHJcblx0JHNjb3BlLmJvb2tzSGVpZ2h0ID0gcGFyc2VJbnQoYW1vdW50UGFnZXMgKiAwLjA5IC8gMTApO1xyXG5cclxufV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdhZGRDYW5jZWxCdG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9hZGQtY2FuY2VsLWJ0bi5odG1sJ1xyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnYWRkZWRNb2RpZmllZCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9hZGRlZC1tb2RpZmllZC1zZWN0aW9uLmh0bWwnLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnYm9va1NlYXJjaFNlY3Rpb24nLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvYm9vay1zZWFyY2gtc2VjdGlvbi5odG1sJyxcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ2RldGFpbHNGbGFncycsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9kZXRhaWxzLWZsYWdzLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHJvdXRlUGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZm9Vcmw6ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2luZm8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRVcmw6ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2NvbnRlbnQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFic3RyYWN0VXJsOiAnIy9ib29rcy8nICsgJHJvdXRlUGFyYW1zLmlkICsgJy9hYnN0cmFjdCdcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2ZsYWdzQ3RybCdcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ2VkaXREZWxldGVCdG4nLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvZWRpdC1kZWxldGUtYnRuLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2tzLCBCb29rKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGVsZXRlQm9vayA9IGZ1bmN0aW9uKCkgeyBcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7IFxyXG4gICAgICAgICAgICAgICAgICAgICBib29rID0gbmV3IEJvb2soYm9vayk7XHJcbiAgICAgICAgICAgICAgICAgICAgIGJvb2suZGVsZXRlKCk7ICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0UGFnZVVybDogJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvZWRpdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlUGFnZVVybDogJyMvYm9va3MnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdlZGl0RGVsQ3RybCdcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ2ZpbHRlckFic3RyYWN0JywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL2ZpbHRlci1hYnN0ci5odG1sJyxcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ21haW5OYXYnLCBbICckbG9jYXRpb24nLCckcm9vdFNjb3BlJywgZnVuY3Rpb24oJGxvY2F0aW9uLCAkcm9vdHNjb3BlKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL21haW4tbmF2Lmh0bWwnLFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgICAgICRyb290c2NvcGUuaXNBY3RpdmVBc2lkZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUub3BlbkFzaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RzY29wZS5pc0FjdGl2ZUFzaWRlID0gISRyb290c2NvcGUuaXNBY3RpdmVBc2lkZTtcclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICBzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uICh2aWV3TG9jYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZpZXdMb2NhdGlvbiA9PT0gJGxvY2F0aW9uLnBhdGgoKTtcclxuICAgICAgICAgICAgICAgIH07ICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ21vZGFsQmFja2Ryb3AnLCBbICckbG9jYXRpb24nLCckcm9vdFNjb3BlJywgZnVuY3Rpb24oJGxvY2F0aW9uLCAkcm9vdHNjb3BlKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL21vZGFsLWJhY2tkcm9wLmh0bWwnLFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICRyb290c2NvcGUuaXNBY3RpdmVBc2lkZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5jbG9zZUFzaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RzY29wZS5pc0FjdGl2ZUFzaWRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9ICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdxdWlja1N0YXRpc3RpY3MnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvcXVpY2stc3RhdGlzdGljcy5odG1sJyxcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ3JhbmRvbVF1b3RlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvcmFuZG9tLXF1b3RlLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAncmFuZG9tUXVvdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAncXVvdGVDdHJsJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdzYXZlQ2FuY2VsQnRuJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL3NhdmUtY2FuY2VsLWJ0bi5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRyb3V0ZVBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrVXJsOiAnIy9ib29rcy8nICsgJHJvdXRlUGFyYW1zLmlkICsgJy9pbmZvJ1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnc2F2ZUNhbmNlbEN0cmwnXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdzdGF0aXN0aWNzU2VjdGlvbicsIFsnQm9va3MnLCBmdW5jdGlvbiAoQm9va3MpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL3N0YXRpc3RpY3Mtc2VjdGlvbi5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRzY29wZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmJvb2tzID0gQm9va3MuZ2V0QWxsQm9va3MoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5maWx0ZXIoJ2Fic3RyYWN0RmlsdGVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaXRlbXMsIHR5cGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGl0ZW1zLCBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVzVG9TaG93LnF1b3RlcyAmJiB0eXBlc1RvU2hvdy5ub3Rlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0eXBlc1RvU2hvdy5xdW90ZXMgJiYgdHlwZXNUb1Nob3cubm90ZXMgJiYgaXRlbS50eXBlID09PSAnbm90ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlc1RvU2hvdy5xdW90ZXMgJiYgIXR5cGVzVG9TaG93Lm5vdGVzICYmIGl0ZW0udHlwZSA9PT0gJ3F1b3RlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkO1xyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5mYWN0b3J5KCdCb29rJywgZnVuY3Rpb24gQm9va0ZhY3RvcnkoKSB7XHJcblxyXG4gICAgdmFyIEJvb2tGYWN0b3J5ID0gZnVuY3Rpb24gKG9iaikge1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gb2JqLmlkO1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSBvYmoudGl0bGUgfHwgbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKG9iai5hdXRob3IpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShvYmouYXV0aG9yKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRob3IgPSBvYmouYXV0aG9yLmpvaW4oJywgJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhvciA9IG9iai5hdXRob3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhvciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmltYWdlID0gb2JqLmltYWdlIHx8IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChvYmouY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShvYmouY2F0ZWdvcnkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhdGVnb3J5ID0gb2JqLmNhdGVnb3J5LmpvaW4oJywgJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhdGVnb3J5ID0gb2JqLmNhdGVnb3J5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXRlZ29yeSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnB1Ymxpc2hlciA9IG9iai5wdWJsaXNoZXIgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLnB1YmxpY2F0aW9uRGF0ZSA9IG9iai5wdWJsaWNhdGlvbkRhdGUgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IG9iai5sZW5ndGggfHwgbnVsbDtcclxuICAgICAgICB0aGlzLnJhdGUgPSBvYmoucmF0ZSB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBvYmouZGVzY3JpcHRpb24gfHwgbnVsbDtcclxuICAgICAgICB0aGlzLnJldmlldyA9IG9iai5yZXZpZXcgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLmFic3RyYWN0SXRlbXMgPSBvYmouYWJzdHJhY3RJdGVtcyB8fCBbXTtcclxuICAgICAgICB0aGlzLnF1b3Rlc0Ftb3VudCA9IG9iai5xdW90ZXNBbW91bnQgfHwgMDtcclxuICAgICAgICB0aGlzLm5vdGVzQW1vdW50ID0gb2JqLm5vdGVzQW1vdW50IHx8IDA7XHJcblxyXG4gICAgICAgIGlmICghb2JqLmFkZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkZWQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tb2RpZmllZCA9IG9iai5tb2RpZmllZCB8fCBuZXcgRGF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgY3VycmVudEJvb2tzID0gW107XHJcblxyXG4gICAgQm9va0ZhY3RvcnkucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRCb29rcyA9IGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50Qm9va3MucHVzaCh0aGlzKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYm9va3MnLCBhbmd1bGFyLnRvSnNvbihjdXJyZW50Qm9va3MpKTtcclxuICAgIH07XHJcblxyXG4gICAgQm9va0ZhY3RvcnkucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAgIGlzTmV3ID0gdHJ1ZTtcclxuICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKSB7XHJcbiAgICAgICAgICAgIHRoYXQuc2F2ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRCb29rcyA9IGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goY3VycmVudEJvb2tzLCBmdW5jdGlvbiAob2JqLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5pZCA9PSB0aGF0LmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRoYXQsIGZ1bmN0aW9uICh2YWx1ZSwgcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdib29rcycsIGFuZ3VsYXIudG9Kc29uKGN1cnJlbnRCb29rcykpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzTmV3ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoaXNOZXcpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuc2F2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBCb29rRmFjdG9yeS5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgICAgY3VycmVudEJvb2tzID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChjdXJyZW50Qm9va3MsIGZ1bmN0aW9uIChvYmosIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLmlkID09IHRoYXQuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Qm9va3Muc3BsaWNlKGluZGV4LCAxKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jvb2tzJywgYW5ndWxhci50b0pzb24oY3VycmVudEJvb2tzKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gQm9va0ZhY3Rvcnk7XHJcbn0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpLmZhY3RvcnkoJ0Jvb2tzJywgZnVuY3Rpb24gQm9va3NGYWN0b3J5KCRodHRwLCBCb29rKSB7XHJcbiAgICB2YXIgZmFjdG9yeSA9IHt9O1xyXG4gICAgZmFjdG9yeS5kZWZhdWx0Y292ZXIgPSBcImltYWdlcy9UaGVfQm9va18oRnJvbnRfQ292ZXIpLmpwZ1wiO1xyXG4gICAgZmFjdG9yeS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYm9va3MvdjEvdXNlcnMvMTE0ODczMjI5MjQwMzM2MzUwMTM0L2Jvb2tzaGVsdmVzLzAvdm9sdW1lc1wiKTtcclxuICAgICAgICBwcm9taXNlLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHZhciBib29rLCBlbG0sIG9iaiwgYXBwQm9va3MgPSByZXNwb25zZS5pdGVtcztcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYXBwQm9va3MpIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGFwcEJvb2tzW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgIG9iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogZWxtLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBlbG0udm9sdW1lSW5mby50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICBhdXRob3I6IGVsbS52b2x1bWVJbmZvLmF1dGhvcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgcHVibGlzaGVyOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgcHVibGljYXRpb25EYXRlOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZWREYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlOiBlbG0udm9sdW1lSW5mby5pbWFnZUxpbmtzLnRodW1ibmFpbCxcclxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogZWxtLnZvbHVtZUluZm8uY2F0ZWdvcmllcyxcclxuICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IGVsbS52b2x1bWVJbmZvLnBhZ2VDb3VudCxcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZWxtLnZvbHVtZUluZm8uZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJvb2sgPSBuZXcgQm9vayhvYmopO1xyXG4gICAgICAgICAgICAgICAgYm9vay51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBmYWN0b3J5LmdldEFsbEJvb2tzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcclxuICAgIH07XHJcbiAgICBmYWN0b3J5LmdldEJvb2tCeUlEID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgdmFyIGJvb2tzID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib29rcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoYm9va3NbaV0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYm9va3NbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBmYWN0b3J5O1xyXG59KTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmZhY3RvcnkoJ0J1dHRvbnMnLCBmdW5jdGlvbiBCdXR0b25zRmFjdG9yeSgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIEJ1dHRvbnMgPSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZVVybEJ0bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICRpbnB1dCA9ICQoJyNpbWFnZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICRib3ggPSAkKCcuY292ZXItYm94JyksXHJcbiAgICAgICAgICAgICAgICAgICAgJG1lc3NhZ2UgPSAkYm94LmZpbmQoJ3NwYW4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkaW5wdXQuc2hvdygpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAkbWVzc2FnZS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAkaW5wdXQub24oJ2ZvY3Vzb3V0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghJGlucHV0LnZhbCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRtZXNzYWdlLmh0bWwoJ2FkZCBjb3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRtZXNzYWdlLmh0bWwoJ2NoYW5nZSBjb3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkbWVzc2FnZS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0LmhpZGUoKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzaG93U2hvcnRJbmZvOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciAkYnRuID0gJChlLnRhcmdldCksXHJcbiAgICAgICAgICAgICAgICAgICAgJGJvb2sgPSAkYnRuLmNsb3Nlc3QoJy5ib29rLWluc3RhbmNlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgJGJveCA9ICRidG4uY2xvc2VzdCgnLmJvb2staW5zdGFuY2UnKS5maW5kKCcubW9yZS1pbmZvLWJveCcpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkYm94LnRvZ2dsZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICRib29rLm9uKCdmb2N1c291dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnamVvZXdvamV3b2V3b2V3aW93cmlvJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGJveC5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc2NyaXB0cyJ9