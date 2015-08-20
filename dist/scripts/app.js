angular.module('bookman', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
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
    .controller('BookAbstractController', ['$scope', '$routeParams', 'Book', 'Books', function($scope, $routeParams, Book, Books) {

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

        $scope.isCurrent = function(tab) {
            return $scope.currentTab === tab;
        };


        $scope.increaseNotesAmount = function() {
            $scope.book.notesAmount++;
        };
        $scope.increaseQuotesAmount = function() {
            $scope.book.quotesAmount++;
        };
        $scope.decreaseNotesAmount = function() {
            $scope.book.notesAmount--;
        };
        $scope.decreaseQuotesAmount = function() {
            $scope.book.quotesAmount--;
        }


        $scope.showAllAbstract = function() {
            $scope.typesToShow = {
                quotes: true,
                notes: true,
                review: true
            }
        };

        $scope.toggleButtons = function($event) {
            var target = $event.currentTarget;

            if (!$(target).hasClass('opened')) {
                $('article').removeClass('opened');
            }
            $(target).toggleClass('opened');
        };


        $scope.updateBookAbstr = function() {
            $scope.book.modified = new Date();
            var currentbook = new Book($scope.book);
            currentbook.update();
        };

        $scope.addAbstrItem = function() {

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

        $scope.editAbstrItem = function($index) {
            $scope.abstrItemToAdd.type = $scope.book.abstractItems[$index].type;
            $scope.abstrItemToAdd.content = $scope.book.abstractItems[$index].content;
            $scope.abstrItemToAdd.index = $index;

            window.scrollTo(0, 0);
            $('textarea').focus();

            $scope.updateBookAbstr();
        };

        $scope.deleteAbstrItem = function($index) {
            if ($scope.book.abstractItems[$index].type === 'quote') {
                $scope.decreaseQuotesAmount();
            } else if ($scope.book.abstractItems[$index].type === 'note') {
                $scope.decreaseNotesAmount();
            }
            $scope.book.abstractItems.splice([$index], 1);

            $scope.updateBookAbstr();
        };

        $scope.editReview = function() {
            $scope.abstrItemToAdd.type = 'review';
            $scope.abstrItemToAdd.content = $scope.book.review;

            window.scrollTo(0, 0);
            $('textarea').focus();

            $scope.updateBookAbstr();
        };

        $scope.deleteReview = function() {
            $scope.book.review = null;
            $scope.updateBookAbstr();
        };
    }]);
angular.module('bookman')
    .controller('BookAddController', ['$scope', 'Book', 'Books', 'Buttons', function($scope, Book, Books, Buttons) {

        $scope.generateId = function() {
            var randomId = '';
            for (var i = 0; i < 12; i++) {
                randomId += Math.ceil(Math.random() * 9);
            }
            return randomId;
        }

        $scope.book = {};

        $scope.addBook = function() {
            if (!$scope.book.title || $scope.book.length < 0 || ($scope.book.rate && $scope.book.rate > 5) || ($scope.book.rate && $scope.book.rate < 1)) {
                return;
            }

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
	.controller('BookContentController', ['$scope', '$routeParams', 'Book', 'Books', function($scope, $routeParams, Book, Books) {

		$scope.book = Books.getBookByID($routeParams.id);
		$scope.currentTab = 'cont';

		$scope.isCurrent = function(tab) {
			return $scope.currentTab === tab;
		}
	}]);
angular.module('bookman')
    .controller('BookEditController', ['$scope', '$routeParams', 'Book', 'Books', 'Buttons', function($scope, $routeParams, Book, Books, Buttons) {

        $scope.book = Books.getBookByID($routeParams.id);

        $scope.editedBookInfo = {};
        for (var param in $scope.book) {
            $scope.editedBookInfo[param] = $scope.book[param];
        }

        if (angular.isArray($scope.editedBookInfo.rate)) {
            $scope.editedBookInfo.rate = $scope.editedBookInfo.rate.length;
        }

        $scope.saveChanges = function() {

            if (!$scope.editedBookInfo.title || $scope.editedBookInfo.length < 0 || ($scope.editedBookInfo.rate && $scope.editedBookInfo.rate > 5) || ($scope.editedBookInfo.rate && $scope.editedBookInfo.rate < 1)) {
                return;
            }

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
	.controller('BookInfoController', ['$scope', '$routeParams', 'Book', 'Books', function($scope, $routeParams, Book, Books) {

		$scope.book = Books.getBookByID($routeParams.id);
		$scope.currentTab = 'info';

		$scope.isCurrent = function(tab) {
			return $scope.currentTab === tab;
		}

	}]);
angular.module('bookman')
	.controller('BooksController', ['$scope', 'Books', 'Book', 'Buttons', function($scope, Books, Book, Buttons) {

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
    .controller('randomQuoteController', ['Books', '$routeParams', function(Books, $routeParams) {
        var controller = this;
        controller.book = Books.getBookByID($routeParams.id);
        controller.quotesAmount = controller.book.quotesAmount;
        controller.quotes = [];
        controller.randomQuote = 'kaka';

        controller.book.abstractItems.forEach(function(item) {
            if (item.type === 'quote') {
                controller.quotes.push(item.content);
            }
        });

        controller.chooseRandomQuote = function() {
            var randomIndex = Math.floor(Math.random() * controller.quotesAmount);
            controller.randomQuote = controller.quotes[randomIndex];
        };
        controller.chooseRandomQuote();
        setInterval(controller.chooseRandomQuote, 1000);

    }]);
angular.module('bookman').controller('SearchController', ['$scope', '$http', 'Books', 'Book', function($scope, $http, Books, Book) {
	$scope.submitSearch = function(form) {
		if (form.$valid) {
			var url;
			$scope.tempBooks = [];

			if ($scope.searchParam.byTerm == "all") {
				url = "https://www.googleapis.com/books/v1/volumes?q=" + $scope.searchParam.text + "&maxResults=20";
			} else {
				url = "https://www.googleapis.com/books/v1/volumes?q=" + $scope.searchParam.byTerm + ":" + $scope.searchParam.text + "&maxResults=20";
			}
			$http.get(url).success(function(response) {
				if (response.totalItems > 0) {
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
							isAdded: false
						}
						if (Books.getBookByID(elm.id)) {
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
angular.module('bookman').controller('StatisticsController', ['$scope', 'Books', 'Book', function($scope, Books, Book) {
	var books = Books.getAllBooks(),
		sumQuotes = 0,
		sumNotes = 0,
		sumReview = 0,
		sumBooksQuotes = 0,
		sumBooksNotes = 0,
		amountPages = 0,
		avarageQuotes,
		avarageNotes;

	function getRandom(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	angular.forEach(books, function(obj) {
		if (obj.quotesAmount) {
			sumBooksQuotes++;
			sumQuotes += obj.quotesAmount;
		}

		if (obj.notesAmount) {
			sumBooksNotes++;
			sumNotes += obj.notesAmount;
		}

		if (obj.review) {
			sumReview++;
		}

		if (obj.length) {
			amountPages += obj.length;
		}
		obj.style = {
			width: getRandom(80, 90),
			left: getRandom(-5, 10),
			height: getRandom(20, 50),
		}
	});

	avarageQuotes = parseInt(sumQuotes / books.length);
	avarageNotes = parseInt(sumNotes / books.length);

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
    .filter('abstractFilter', function() {
        return function(items, typesToShow) {
            var filtered = [];

            angular.forEach(items, function(item) {
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
angular.module('bookman')
	.directive('addCancelBtn', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/directives/add-cancel-btn.html'
		};
	});
angular.module('bookman')
	.directive('addedModified', function() {

		return {
			restrict: 'E',
			templateUrl: 'templates/directives/added-modified-section.html',
		}

	});
angular.module('bookman')
	.directive('bookSearchSection', function() {

		return {
			restrict: 'E',
			templateUrl: 'templates/directives/book-search-section.html',
		}

	});
angular.module('bookman')
    .directive('detailsFlags', function() {

        return {
            restrict: 'A',
            templateUrl: 'templates/directives/details-flags.html',
            controller: function($routeParams) {
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
    .directive('editDeleteBtn', function() {

        return {
            restrict: 'E',
            templateUrl: 'templates/directives/edit-delete-btn.html',
            controller: function($scope, $routeParams, Books, Book) {
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
	.directive('filterAbstract', function() {

		return {
			restrict: 'E',
			templateUrl: 'templates/directives/filter-abstr.html',
		}

	});
angular.module('bookman')
    .directive('mainNav', ['$location', '$rootScope', function($location, $rootscope) {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/main-nav.html',
            link: function(scope, element, attrs) {
                $rootscope.isActiveAside = false;
                scope.openAside = function() {
                    $rootscope.isActiveAside = !$rootscope.isActiveAside;
                }
                scope.isActive = function(viewLocation) {
                    return viewLocation === $location.path();
                };
            }
        }
    }]);
angular.module('bookman')
    .directive('modalBackdrop', ['$location', '$rootScope', function($location, $rootscope) {
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
	.directive('quickStatistics', function() {

		return {
			restrict: 'E',
			templateUrl: 'templates/directives/quick-statistics.html',
		}

	});
angular.module('bookman')
	.directive('randomQuote', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/directives/random-quote.html',
			controller: 'randomQuoteController',
			controllerAs: 'quoteCtrl'
		}
	});
angular.module('bookman')
    .directive('saveCancelBtn', function() {

        return {
            restrict: 'E',
            templateUrl: 'templates/directives/save-cancel-btn.html',
            controller: function($routeParams) {
                return {
                    backUrl: '#/books/' + $routeParams.id + '/info'
                };
            },
            controllerAs: 'saveCancelCtrl'
        }

    });
angular.module('bookman')
	.directive('statisticsSection', ['Books', function(Books) {
		return {
			restrict: 'E',
			templateUrl: 'templates/directives/statistics-section.html',
			controller: function($scope) {
				$scope.books = Books.getAllBooks();
			}
		};
	}]);
angular.module('bookman').factory('Book', function BookFactory() {

    var BookFactory = function(obj) {

        this.id = obj.id;
        this.title = obj.title || null;
        this.author = angular.isArray(obj.author) ? obj.author.join(', ') : obj.author || null;
        this.image = obj.image || 'images/Book.jpg';
        this.category = angular.isArray(obj.category) ? obj.category.join(', ') : obj.category || null;
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

    BookFactory.prototype.save = function() {
        if (localStorage.getItem('books')) {
            currentBooks = angular.fromJson(localStorage.getItem('books'));
        }
        currentBooks.push(this);
        localStorage.setItem('books', angular.toJson(currentBooks));
    };

    BookFactory.prototype.update = function() {
        var that = this,
            isNew = true;
        if (!localStorage.getItem('books')) {
            that.save();
        } else {
            currentBooks = angular.fromJson(localStorage.getItem('books'));
            angular.forEach(currentBooks, function(obj, index) {
                if (obj.id == that.id) {
                    angular.forEach(that, function(value, property) {
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

    BookFactory.prototype.delete = function() {
        var that = this,
            currentBooks = angular.fromJson(localStorage.getItem('books'));
        angular.forEach(currentBooks, function(obj, index) {
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
    factory.defaultcover = "images/Book.jpg";
    factory.init = function() {
        var promise = $http.get("https://www.googleapis.com/books/v1/users/114873229240336350134/bookshelves/0/volumes");
        promise.success(function(response) {
            var book, elm, obj, appBooks = response.items;
            for (var property in appBooks) {
                elm = appBooks[property];
                obj = {
                    id: elm.id,
                    title: elm.volumeInfo.title,
                    author: elm.volumeInfo.authors,
                    publisher: elm.volumeInfo.publisher,
                    publicationDate: elm.volumeInfo.publishedDate,
                    image: elm.volumeInfo.imageLinks ? elm.volumeInfo.imageLinks.thumbnail : factory.defaultcover,
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

    factory.getAllBooks = function() {
        return angular.fromJson(localStorage.getItem('books'));
    };
    factory.getBookByID = function(id) {
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
            toggleUrlBtn: function() {
                var $input = $('#image'),
                    $box = $('.cover-box'),
                    $message = $box.find('span');

                $input.show().focus();
                $message.hide();
                $input.on('focusout', function() {
                    if (!$input.val()) {
                        $message.html('add cover');
                    } else {
                        $message.html('change cover');
                    }
                    $message.show();
                    $input.hide()
                });
            },

            showShortInfo: function(e) {
                e.preventDefault();

                var $btn = $(e.target),
                    $book = $btn.closest('.book-instance'),
                    $box = $btn.closest('.book-instance').find('.more-info-box');

                $box.toggleClass('opened');
                $book.on('focusout', function() {
                    $box.removeClass('opened');
                });
            }
        }

    });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWJzdHJhY3QtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stYWRkLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rLWNvbnRlbnQtY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Jvb2stZWRpdC1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYm9vay1pbmZvLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ib29rcy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcmFuZG9tLXF1b3Rlcy1jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvc2VhcmNoLWNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9zdGF0aXN0aWNzLWNvbnRyb2xsZXIuanMiLCJmaWx0ZXJzL2Fic3RyYWN0LWZpbHRlci5qcyIsImRpcmVjdGl2ZXMvYWRkLWNhbmNlbC1idG4tZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9hZGRlZC1tb2RpZmllZC1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL2Jvb2stc2VhcmNoLXNlY3Rpb24tZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9kZXRhaWxzLWZsYWdzLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvZWRpdC1kZWxldGUtYnRuLWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvZmlsdGVyLWFic3RyYWN0LWRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvbWFpbi1uYXYtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9tb2RhbC1iYWNrZHJvcC1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3F1aWNrLXN0YXRpc3RpY3MtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9yYW5kb20tcXVvdGUtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9zYXZlLWNhbmNlbC1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3N0YXRpc3RpY3Mtc2VjdGlvbi1kaXJlY3RpdmUuanMiLCJzZXJ2aWNlcy9ib29rLWZhY3RvcnkuanMiLCJzZXJ2aWNlcy9ib29rcy1mYWN0b3J5LmpzIiwic2VydmljZXMvYnV0dG9ucy1mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicsIFsnbmdSb3V0ZSddKS5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgICAgICByZWRpcmVjdFRvOiAnL2Jvb2tzJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rc0N0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL3NlYXJjaCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvc2VhcmNoL2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU2VhcmNoQ29udHJvbGxlcidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvc3RhdGlzdGljcycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvc3RhdGlzdGljcy9pbmRleC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1N0YXRpc3RpY3NDb250cm9sbGVyJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9hYm91dCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYWJvdXQvaW5kZXguaHRtbCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYWRkJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wYWdlcy9ib29rcy9hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQWRkQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tBZGRDdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvaW5mbycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGFnZXMvYm9va3MvZGV0YWlscy9pbmZvLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va0luZm9Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va0luZm9DdHJsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9ib29rcy86aWQvYWJzdHJhY3QnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2RldGFpbHMvYWJzdHJhY3QuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQWJzdHJhY3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9va0Fic3RyQ3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MvOmlkL2NvbnRlbnQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2RldGFpbHMvY29udGVudC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tDb250ZW50Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2tDb250Q3RybCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYm9va3MvOmlkL2VkaXQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BhZ2VzL2Jvb2tzL2VkaXQuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rRWRpdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rRWRpdEN0cmwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAub3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9ib29rcydcclxuICAgICAgICB9KVxyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tBYnN0cmFjdENvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQm9vaycsICdCb29rcycsIGZ1bmN0aW9uKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBCb29rLCBCb29rcykge1xyXG5cclxuICAgICAgICAkc2NvcGUuYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRUYWIgPSAnYWJzdHInO1xyXG5cclxuICAgICAgICAkc2NvcGUudHlwZXNUb1Nob3cgPSB7XHJcbiAgICAgICAgICAgIHF1b3RlczogdHJ1ZSxcclxuICAgICAgICAgICAgbm90ZXM6IHRydWUsXHJcbiAgICAgICAgICAgIHJldmlldzogdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAncXVvdGUnLFxyXG4gICAgICAgICAgICBjb250ZW50OiAnJyxcclxuICAgICAgICAgICAgaW5kZXg6IG51bGxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuaXNDdXJyZW50ID0gZnVuY3Rpb24odGFiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuY3VycmVudFRhYiA9PT0gdGFiO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUuaW5jcmVhc2VOb3Rlc0Ftb3VudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5ub3Rlc0Ftb3VudCsrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHNjb3BlLmluY3JlYXNlUXVvdGVzQW1vdW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLnF1b3Rlc0Ftb3VudCsrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHNjb3BlLmRlY3JlYXNlTm90ZXNBbW91bnQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmJvb2subm90ZXNBbW91bnQtLTtcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS5kZWNyZWFzZVF1b3Rlc0Ftb3VudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5xdW90ZXNBbW91bnQtLTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUuc2hvd0FsbEFic3RyYWN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICRzY29wZS50eXBlc1RvU2hvdyA9IHtcclxuICAgICAgICAgICAgICAgIHF1b3RlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG5vdGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmV2aWV3OiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUudG9nZ2xlQnV0dG9ucyA9IGZ1bmN0aW9uKCRldmVudCkge1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJGV2ZW50LmN1cnJlbnRUYXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoISQodGFyZ2V0KS5oYXNDbGFzcygnb3BlbmVkJykpIHtcclxuICAgICAgICAgICAgICAgICQoJ2FydGljbGUnKS5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJCh0YXJnZXQpLnRvZ2dsZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgJHNjb3BlLnVwZGF0ZUJvb2tBYnN0ciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5tb2RpZmllZCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Ym9vayA9IG5ldyBCb29rKCRzY29wZS5ib29rKTtcclxuICAgICAgICAgICAgY3VycmVudGJvb2sudXBkYXRlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmFkZEFic3RySXRlbSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGVkaXRlZEl0ZW0gPSAkc2NvcGUuYWJzdHJJdGVtVG9BZGQsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50SXRlbSA9ICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXNbJHNjb3BlLmFic3RySXRlbVRvQWRkLmluZGV4XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlZGl0ZWRJdGVtLmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlZGl0ZWRJdGVtLmluZGV4ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkaXRlZEl0ZW0udHlwZSA9PT0gJ3JldmlldycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJvb2sucmV2aWV3ID0gZWRpdGVkSXRlbS5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXMucHVzaChlZGl0ZWRJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVkaXRlZEl0ZW0udHlwZSA9PT0gJ3F1b3RlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmluY3JlYXNlUXVvdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5jcmVhc2VOb3Rlc0Ftb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEl0ZW0udHlwZSA9PT0gJ25vdGUnICYmIGVkaXRlZEl0ZW0udHlwZSA9PT0gJ3F1b3RlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGVjcmVhc2VOb3Rlc0Ftb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5jcmVhc2VRdW90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRJdGVtLnR5cGUgPT09ICdxdW90ZScgJiYgZWRpdGVkSXRlbS50eXBlID09PSAnbm90ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRlY3JlYXNlUXVvdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmNyZWFzZU5vdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlZGl0ZWRJdGVtLnR5cGUgPT09ICdyZXZpZXcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5ib29rLnJldmlldyA9IGVkaXRlZEl0ZW0uY29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRlbGV0ZUFic3RySXRlbShlZGl0ZWRJdGVtLmluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3F1b3RlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SXRlbS5jb250ZW50ID0gZWRpdGVkSXRlbS5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJdGVtLnR5cGUgPSBlZGl0ZWRJdGVtLnR5cGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3F1b3RlJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAnJyxcclxuICAgICAgICAgICAgICAgICAgICBpbmRleDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlQm9va0Fic3RyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuZWRpdEFic3RySXRlbSA9IGZ1bmN0aW9uKCRpbmRleCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQudHlwZSA9ICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXNbJGluZGV4XS50eXBlO1xyXG4gICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQuY29udGVudCA9ICRzY29wZS5ib29rLmFic3RyYWN0SXRlbXNbJGluZGV4XS5jb250ZW50O1xyXG4gICAgICAgICAgICAkc2NvcGUuYWJzdHJJdGVtVG9BZGQuaW5kZXggPSAkaW5kZXg7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XHJcbiAgICAgICAgICAgICQoJ3RleHRhcmVhJykuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVCb29rQWJzdHIoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuZGVsZXRlQWJzdHJJdGVtID0gZnVuY3Rpb24oJGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zWyRpbmRleF0udHlwZSA9PT0gJ3F1b3RlJykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmRlY3JlYXNlUXVvdGVzQW1vdW50KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJHNjb3BlLmJvb2suYWJzdHJhY3RJdGVtc1skaW5kZXhdLnR5cGUgPT09ICdub3RlJykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmRlY3JlYXNlTm90ZXNBbW91bnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5hYnN0cmFjdEl0ZW1zLnNwbGljZShbJGluZGV4XSwgMSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlQm9va0Fic3RyKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmVkaXRSZXZpZXcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkLnR5cGUgPSAncmV2aWV3JztcclxuICAgICAgICAgICAgJHNjb3BlLmFic3RySXRlbVRvQWRkLmNvbnRlbnQgPSAkc2NvcGUuYm9vay5yZXZpZXc7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XHJcbiAgICAgICAgICAgICQoJ3RleHRhcmVhJykuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVCb29rQWJzdHIoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuZGVsZXRlUmV2aWV3ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5ib29rLnJldmlldyA9IG51bGw7XHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVCb29rQWJzdHIoKTtcclxuICAgICAgICB9O1xyXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5jb250cm9sbGVyKCdCb29rQWRkQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0Jvb2snLCAnQm9va3MnLCAnQnV0dG9ucycsIGZ1bmN0aW9uKCRzY29wZSwgQm9vaywgQm9va3MsIEJ1dHRvbnMpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmdlbmVyYXRlSWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJhbmRvbUlkID0gJyc7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmFuZG9tSWQgKz0gTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiA5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tSWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuYm9vayA9IHt9O1xyXG5cclxuICAgICAgICAkc2NvcGUuYWRkQm9vayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoISRzY29wZS5ib29rLnRpdGxlIHx8ICRzY29wZS5ib29rLmxlbmd0aCA8IDAgfHwgKCRzY29wZS5ib29rLnJhdGUgJiYgJHNjb3BlLmJvb2sucmF0ZSA+IDUpIHx8ICgkc2NvcGUuYm9vay5yYXRlICYmICRzY29wZS5ib29rLnJhdGUgPCAxKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmJvb2sucmF0ZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmJvb2sucmF0ZSA9IFsnMSBzdGFyJywgJzIgc3RhcnMnLCAnMyBzdGFycycsICc0IHN0YXJzJywgJzUgc3RhcnMnXS5zbGljZSgwLCAkc2NvcGUuYm9vay5yYXRlKTtcclxuICAgICAgICAgICAgICAgIC8vIGZvciBpdGVyYXRpbmcgcmF0ZS1zdGFyc1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGxvb2tzIHByZXR0eSBzdHJhbmdlLCBidXQgaXQgaXMgdGhlIGVhc2llc3QgaGVscGVyIGZvciBuZy1yZXBlYXQgd2hpY2ggSSd2ZSBkaXNjb3ZlcmVkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHNjb3BlLmJvb2suaWQgPSAkc2NvcGUuZ2VuZXJhdGVJZCgpO1xyXG4gICAgICAgICAgICBuZXcgQm9vaygkc2NvcGUuYm9vaykuc2F2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZ2dsZVVybEJ0biA9IEJ1dHRvbnMudG9nZ2xlVXJsQnRuO1xyXG5cclxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcblx0LmNvbnRyb2xsZXIoJ0Jvb2tDb250ZW50Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdCb29rJywgJ0Jvb2tzJywgZnVuY3Rpb24oJHNjb3BlLCAkcm91dGVQYXJhbXMsIEJvb2ssIEJvb2tzKSB7XHJcblxyXG5cdFx0JHNjb3BlLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG5cdFx0JHNjb3BlLmN1cnJlbnRUYWIgPSAnY29udCc7XHJcblxyXG5cdFx0JHNjb3BlLmlzQ3VycmVudCA9IGZ1bmN0aW9uKHRhYikge1xyXG5cdFx0XHRyZXR1cm4gJHNjb3BlLmN1cnJlbnRUYWIgPT09IHRhYjtcclxuXHRcdH1cclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0Jvb2tFZGl0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdCb29rJywgJ0Jvb2tzJywgJ0J1dHRvbnMnLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9vaywgQm9va3MsIEJ1dHRvbnMpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG5cclxuICAgICAgICAkc2NvcGUuZWRpdGVkQm9va0luZm8gPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBwYXJhbSBpbiAkc2NvcGUuYm9vaykge1xyXG4gICAgICAgICAgICAkc2NvcGUuZWRpdGVkQm9va0luZm9bcGFyYW1dID0gJHNjb3BlLmJvb2tbcGFyYW1dO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheSgkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSkpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnJhdGUgPSAkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuc2F2ZUNoYW5nZXMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnRpdGxlIHx8ICRzY29wZS5lZGl0ZWRCb29rSW5mby5sZW5ndGggPCAwIHx8ICgkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSAmJiAkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSA+IDUpIHx8ICgkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSAmJiAkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSA8IDEpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUuZWRpdGVkQm9va0luZm8ucmF0ZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnJhdGUgPSBbJzEgc3RhcicsICcyIHN0YXJzJywgJzMgc3RhcnMnLCAnNCBzdGFycycsICc1IHN0YXJzJ10uc2xpY2UoMCwgJHNjb3BlLmVkaXRlZEJvb2tJbmZvLnJhdGUpO1xyXG4gICAgICAgICAgICAgICAgLy8gZm9yIGl0ZXJhdGluZyByYXRlLXN0YXJzXHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgbG9va3MgcHJldHR5IHN0cmFuZ2UsIGJ1dCBpdCBpcyB0aGUgZWFzaWVzdCBoZWxwZXIgZm9yIG5nLXJlcGVhdCB3aGljaCBJJ3ZlIGRpc2NvdmVyZWRcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgcGFyYW0gaW4gJHNjb3BlLmVkaXRlZEJvb2tJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYm9va1twYXJhbV0gPSAkc2NvcGUuZWRpdGVkQm9va0luZm9bcGFyYW1dO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYm9vay5tb2RpZmllZCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIG5ldyBCb29rKCRzY29wZS5ib29rKS51cGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS50b2dnbGVVcmxCdG4gPSBCdXR0b25zLnRvZ2dsZVVybEJ0bjtcclxuXHJcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG5cdC5jb250cm9sbGVyKCdCb29rSW5mb0NvbnRyb2xsZXInLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQm9vaycsICdCb29rcycsIGZ1bmN0aW9uKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBCb29rLCBCb29rcykge1xyXG5cclxuXHRcdCRzY29wZS5ib29rID0gQm9va3MuZ2V0Qm9va0J5SUQoJHJvdXRlUGFyYW1zLmlkKTtcclxuXHRcdCRzY29wZS5jdXJyZW50VGFiID0gJ2luZm8nO1xyXG5cclxuXHRcdCRzY29wZS5pc0N1cnJlbnQgPSBmdW5jdGlvbih0YWIpIHtcclxuXHRcdFx0cmV0dXJuICRzY29wZS5jdXJyZW50VGFiID09PSB0YWI7XHJcblx0XHR9XHJcblxyXG5cdH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcblx0LmNvbnRyb2xsZXIoJ0Jvb2tzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0Jvb2tzJywgJ0Jvb2snLCAnQnV0dG9ucycsIGZ1bmN0aW9uKCRzY29wZSwgQm9va3MsIEJvb2ssIEJ1dHRvbnMpIHtcclxuXHJcblx0XHRpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKSB7XHJcblx0XHRcdEJvb2tzLmluaXQoKS50aGVuKGZ1bmN0aW9uKHByb21pc2UpIHtcclxuXHRcdFx0XHQkc2NvcGUuYm9va3MgPSBCb29rcy5nZXRBbGxCb29rcygpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCRzY29wZS5ib29rcyA9IEJvb2tzLmdldEFsbEJvb2tzKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JHNjb3BlLnNob3dTaG9ydEluZm8gPSBCdXR0b25zLnNob3dTaG9ydEluZm87XHJcblxyXG5cdH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuY29udHJvbGxlcigncmFuZG9tUXVvdGVDb250cm9sbGVyJywgWydCb29rcycsICckcm91dGVQYXJhbXMnLCBmdW5jdGlvbihCb29rcywgJHJvdXRlUGFyYW1zKSB7XHJcbiAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSB0aGlzO1xyXG4gICAgICAgIGNvbnRyb2xsZXIuYm9vayA9IEJvb2tzLmdldEJvb2tCeUlEKCRyb3V0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgY29udHJvbGxlci5xdW90ZXNBbW91bnQgPSBjb250cm9sbGVyLmJvb2sucXVvdGVzQW1vdW50O1xyXG4gICAgICAgIGNvbnRyb2xsZXIucXVvdGVzID0gW107XHJcbiAgICAgICAgY29udHJvbGxlci5yYW5kb21RdW90ZSA9ICdrYWthJztcclxuXHJcbiAgICAgICAgY29udHJvbGxlci5ib29rLmFic3RyYWN0SXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdxdW90ZScpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIucXVvdGVzLnB1c2goaXRlbS5jb250ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb250cm9sbGVyLmNob29zZVJhbmRvbVF1b3RlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbnRyb2xsZXIucXVvdGVzQW1vdW50KTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5yYW5kb21RdW90ZSA9IGNvbnRyb2xsZXIucXVvdGVzW3JhbmRvbUluZGV4XTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnRyb2xsZXIuY2hvb3NlUmFuZG9tUXVvdGUoKTtcclxuICAgICAgICBzZXRJbnRlcnZhbChjb250cm9sbGVyLmNob29zZVJhbmRvbVF1b3RlLCAxMDAwKTtcclxuXHJcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5jb250cm9sbGVyKCdTZWFyY2hDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGh0dHAnLCAnQm9va3MnLCAnQm9vaycsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsIEJvb2tzLCBCb29rKSB7XHJcblx0JHNjb3BlLnN1Ym1pdFNlYXJjaCA9IGZ1bmN0aW9uKGZvcm0pIHtcclxuXHRcdGlmIChmb3JtLiR2YWxpZCkge1xyXG5cdFx0XHR2YXIgdXJsO1xyXG5cdFx0XHQkc2NvcGUudGVtcEJvb2tzID0gW107XHJcblxyXG5cdFx0XHRpZiAoJHNjb3BlLnNlYXJjaFBhcmFtLmJ5VGVybSA9PSBcImFsbFwiKSB7XHJcblx0XHRcdFx0dXJsID0gXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9ib29rcy92MS92b2x1bWVzP3E9XCIgKyAkc2NvcGUuc2VhcmNoUGFyYW0udGV4dCArIFwiJm1heFJlc3VsdHM9MjBcIjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR1cmwgPSBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2Jvb2tzL3YxL3ZvbHVtZXM/cT1cIiArICRzY29wZS5zZWFyY2hQYXJhbS5ieVRlcm0gKyBcIjpcIiArICRzY29wZS5zZWFyY2hQYXJhbS50ZXh0ICsgXCImbWF4UmVzdWx0cz0yMFwiO1xyXG5cdFx0XHR9XHJcblx0XHRcdCRodHRwLmdldCh1cmwpLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2UudG90YWxJdGVtcyA+IDApIHtcclxuXHRcdFx0XHRcdHZhciBlbG0sIG9iaiwgYXBwQm9va3MgPSByZXNwb25zZS5pdGVtcztcclxuXHRcdFx0XHRcdGZvciAodmFyIHByb3BlcnR5IGluIGFwcEJvb2tzKSB7XHJcblx0XHRcdFx0XHRcdGVsbSA9IGFwcEJvb2tzW3Byb3BlcnR5XTtcclxuXHRcdFx0XHRcdFx0b2JqID0ge1xyXG5cdFx0XHRcdFx0XHRcdGlkOiBlbG0uaWQsXHJcblx0XHRcdFx0XHRcdFx0dGl0bGU6IGVsbS52b2x1bWVJbmZvLnRpdGxlLFxyXG5cdFx0XHRcdFx0XHRcdGF1dGhvcjogYW5ndWxhci5pc0FycmF5KGVsbS52b2x1bWVJbmZvLmF1dGhvcnMpID8gZWxtLnZvbHVtZUluZm8uYXV0aG9ycy5qb2luKCcsICcpIDogZWxtLnZvbHVtZUluZm8uYXV0aG9ycyB8fCBcIlwiLFxyXG5cdFx0XHRcdFx0XHRcdGltYWdlOiBlbG0udm9sdW1lSW5mby5pbWFnZUxpbmtzID8gZWxtLnZvbHVtZUluZm8uaW1hZ2VMaW5rcy50aHVtYm5haWwgOiBCb29rcy5kZWZhdWx0Y292ZXIsXHJcblx0XHRcdFx0XHRcdFx0cHVibGlzaGVyOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZXIsXHJcblx0XHRcdFx0XHRcdFx0cHVibGljYXRpb25EYXRlOiBlbG0udm9sdW1lSW5mby5wdWJsaXNoZWREYXRlLFxyXG5cdFx0XHRcdFx0XHRcdGNhdGVnb3J5OiBlbG0udm9sdW1lSW5mby5jYXRlZ29yaWVzLFxyXG5cdFx0XHRcdFx0XHRcdGxlbmd0aDogZWxtLnZvbHVtZUluZm8ucGFnZUNvdW50LFxyXG5cdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBlbG0udm9sdW1lSW5mby5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRpc0FkZGVkOiBmYWxzZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChCb29rcy5nZXRCb29rQnlJRChlbG0uaWQpKSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqLmlzQWRkZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCRzY29wZS50ZW1wQm9va3MucHVzaChvYmopO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0JHNjb3BlLmFkZEJvb2sgPSBmdW5jdGlvbihpbmRleCwgYm9vaykge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUudGVtcEJvb2tzW2luZGV4XS5pc0FkZGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0dmFyIG5ld0Jvb2sgPSBuZXcgQm9vayhib29rKTtcclxuXHRcdFx0XHRcdFx0bmV3Qm9vay5zYXZlKCk7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5ib29rcyA9IEJvb2tzLmdldEFsbEJvb2tzKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkc2NvcGUubm9SZXN1bHRzID0gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdCRzY29wZS5ub1Jlc3VsdHMgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5jb250cm9sbGVyKCdTdGF0aXN0aWNzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0Jvb2tzJywgJ0Jvb2snLCBmdW5jdGlvbigkc2NvcGUsIEJvb2tzLCBCb29rKSB7XHJcblx0dmFyIGJvb2tzID0gQm9va3MuZ2V0QWxsQm9va3MoKSxcclxuXHRcdHN1bVF1b3RlcyA9IDAsXHJcblx0XHRzdW1Ob3RlcyA9IDAsXHJcblx0XHRzdW1SZXZpZXcgPSAwLFxyXG5cdFx0c3VtQm9va3NRdW90ZXMgPSAwLFxyXG5cdFx0c3VtQm9va3NOb3RlcyA9IDAsXHJcblx0XHRhbW91bnRQYWdlcyA9IDAsXHJcblx0XHRhdmFyYWdlUXVvdGVzLFxyXG5cdFx0YXZhcmFnZU5vdGVzO1xyXG5cclxuXHRmdW5jdGlvbiBnZXRSYW5kb20obWluLCBtYXgpIHtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG5cdH1cclxuXHJcblx0YW5ndWxhci5mb3JFYWNoKGJvb2tzLCBmdW5jdGlvbihvYmopIHtcclxuXHRcdGlmIChvYmoucXVvdGVzQW1vdW50KSB7XHJcblx0XHRcdHN1bUJvb2tzUXVvdGVzKys7XHJcblx0XHRcdHN1bVF1b3RlcyArPSBvYmoucXVvdGVzQW1vdW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChvYmoubm90ZXNBbW91bnQpIHtcclxuXHRcdFx0c3VtQm9va3NOb3RlcysrO1xyXG5cdFx0XHRzdW1Ob3RlcyArPSBvYmoubm90ZXNBbW91bnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG9iai5yZXZpZXcpIHtcclxuXHRcdFx0c3VtUmV2aWV3Kys7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG9iai5sZW5ndGgpIHtcclxuXHRcdFx0YW1vdW50UGFnZXMgKz0gb2JqLmxlbmd0aDtcclxuXHRcdH1cclxuXHRcdG9iai5zdHlsZSA9IHtcclxuXHRcdFx0d2lkdGg6IGdldFJhbmRvbSg4MCwgOTApLFxyXG5cdFx0XHRsZWZ0OiBnZXRSYW5kb20oLTUsIDEwKSxcclxuXHRcdFx0aGVpZ2h0OiBnZXRSYW5kb20oMjAsIDUwKSxcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0YXZhcmFnZVF1b3RlcyA9IHBhcnNlSW50KHN1bVF1b3RlcyAvIGJvb2tzLmxlbmd0aCk7XHJcblx0YXZhcmFnZU5vdGVzID0gcGFyc2VJbnQoc3VtTm90ZXMgLyBib29rcy5sZW5ndGgpO1xyXG5cclxuXHQkc2NvcGUuc3RhdGlzdGljcyA9IHtcclxuXHRcdGFtb3VudEJvb2tzOiBib29rcy5sZW5ndGgsXHJcblx0XHRhdmFyYWdlTm90ZXM6IGF2YXJhZ2VOb3RlcyxcclxuXHRcdHN1bUJvb2tzTm90ZXM6IHN1bUJvb2tzTm90ZXMsXHJcblx0XHRhdmFyYWdlUXVvdGVzOiBhdmFyYWdlUXVvdGVzLFxyXG5cdFx0c3VtQm9va3NRdW90ZXM6IHN1bUJvb2tzUXVvdGVzLFxyXG5cdFx0cXVvdGVzQW1vdW50QWxsOiBzdW1RdW90ZXMsXHJcblx0XHRub3Rlc0Ftb3VudEFsbDogc3VtTm90ZXMsXHJcblx0XHRyZXZpZXdBbW91bnRBbGw6IHN1bVJldmlld1xyXG5cdH07XHJcblx0JHNjb3BlLmJvb2tzID0gYm9va3M7XHJcblxyXG5cdCRzY29wZS5ib29rc0hlaWdodCA9IHBhcnNlSW50KGFtb3VudFBhZ2VzICogMC4wOSAvIDEwKTtcclxuXHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZmlsdGVyKCdhYnN0cmFjdEZpbHRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpdGVtcywgdHlwZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gW107XHJcblxyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlc1RvU2hvdy5xdW90ZXMgJiYgdHlwZXNUb1Nob3cubm90ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdHlwZXNUb1Nob3cucXVvdGVzICYmIHR5cGVzVG9TaG93Lm5vdGVzICYmIGl0ZW0udHlwZSA9PT0gJ25vdGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZXNUb1Nob3cucXVvdGVzICYmICF0eXBlc1RvU2hvdy5ub3RlcyAmJiBpdGVtLnR5cGUgPT09ICdxdW90ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZDtcclxuICAgICAgICB9O1xyXG4gICAgfSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG5cdC5kaXJlY3RpdmUoJ2FkZENhbmNlbEJ0bicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcclxuXHRcdFx0dGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9hZGQtY2FuY2VsLWJ0bi5odG1sJ1xyXG5cdFx0fTtcclxuXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcblx0LmRpcmVjdGl2ZSgnYWRkZWRNb2RpZmllZCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJlc3RyaWN0OiAnRScsXHJcblx0XHRcdHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvYWRkZWQtbW9kaWZpZWQtc2VjdGlvbi5odG1sJyxcclxuXHRcdH1cclxuXHJcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG5cdC5kaXJlY3RpdmUoJ2Jvb2tTZWFyY2hTZWN0aW9uJywgZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcclxuXHRcdFx0dGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9ib29rLXNlYXJjaC1zZWN0aW9uLmh0bWwnLFxyXG5cdFx0fVxyXG5cclxuXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdkZXRhaWxzRmxhZ3MnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9kZXRhaWxzLWZsYWdzLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkcm91dGVQYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mb1VybDogJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvaW5mbycsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFVybDogJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvY29udGVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYWJzdHJhY3RVcmw6ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2Fic3RyYWN0J1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnZmxhZ3NDdHJsJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZGlyZWN0aXZlKCdlZGl0RGVsZXRlQnRuJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvZWRpdC1kZWxldGUtYnRuLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcywgQm9va3MsIEJvb2spIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5kZWxldGVCb29rID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJvb2sgPSBCb29rcy5nZXRCb29rQnlJRCgkcm91dGVQYXJhbXMuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvb2sgPSBuZXcgQm9vayhib29rKTtcclxuICAgICAgICAgICAgICAgICAgICBib29rLmRlbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0UGFnZVVybDogJyMvYm9va3MvJyArICRyb3V0ZVBhcmFtcy5pZCArICcvZWRpdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlUGFnZVVybDogJyMvYm9va3MnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdlZGl0RGVsQ3RybCdcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG5cdC5kaXJlY3RpdmUoJ2ZpbHRlckFic3RyYWN0JywgZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcclxuXHRcdFx0dGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9maWx0ZXItYWJzdHIuaHRtbCcsXHJcblx0XHR9XHJcblxyXG5cdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ21haW5OYXYnLCBbJyRsb2NhdGlvbicsICckcm9vdFNjb3BlJywgZnVuY3Rpb24oJGxvY2F0aW9uLCAkcm9vdHNjb3BlKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9tYWluLW5hdi5odG1sJyxcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICAkcm9vdHNjb3BlLmlzQWN0aXZlQXNpZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLm9wZW5Bc2lkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRyb290c2NvcGUuaXNBY3RpdmVBc2lkZSA9ICEkcm9vdHNjb3BlLmlzQWN0aXZlQXNpZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uKHZpZXdMb2NhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2aWV3TG9jYXRpb24gPT09ICRsb2NhdGlvbi5wYXRoKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuICAgIC5kaXJlY3RpdmUoJ21vZGFsQmFja2Ryb3AnLCBbJyRsb2NhdGlvbicsICckcm9vdFNjb3BlJywgZnVuY3Rpb24oJGxvY2F0aW9uLCAkcm9vdHNjb3BlKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9tb2RhbC1iYWNrZHJvcC5odG1sJyxcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICAkcm9vdHNjb3BlLmlzQWN0aXZlQXNpZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuY2xvc2VBc2lkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRyb290c2NvcGUuaXNBY3RpdmVBc2lkZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuXHQuZGlyZWN0aXZlKCdxdWlja1N0YXRpc3RpY3MnLCBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRyZXN0cmljdDogJ0UnLFxyXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL3F1aWNrLXN0YXRpc3RpY3MuaHRtbCcsXHJcblx0XHR9XHJcblxyXG5cdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdib29rbWFuJylcclxuXHQuZGlyZWN0aXZlKCdyYW5kb21RdW90ZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcclxuXHRcdFx0dGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9yYW5kb20tcXVvdGUuaHRtbCcsXHJcblx0XHRcdGNvbnRyb2xsZXI6ICdyYW5kb21RdW90ZUNvbnRyb2xsZXInLFxyXG5cdFx0XHRjb250cm9sbGVyQXM6ICdxdW90ZUN0cmwnXHJcblx0XHR9XHJcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG4gICAgLmRpcmVjdGl2ZSgnc2F2ZUNhbmNlbEJ0bicsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL3NhdmUtY2FuY2VsLWJ0bi5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHJvdXRlUGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tVcmw6ICcjL2Jvb2tzLycgKyAkcm91dGVQYXJhbXMuaWQgKyAnL2luZm8nXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdzYXZlQ2FuY2VsQ3RybCdcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKVxyXG5cdC5kaXJlY3RpdmUoJ3N0YXRpc3RpY3NTZWN0aW9uJywgWydCb29rcycsIGZ1bmN0aW9uKEJvb2tzKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRyZXN0cmljdDogJ0UnLFxyXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL3N0YXRpc3RpY3Mtc2VjdGlvbi5odG1sJyxcclxuXHRcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XHJcblx0XHRcdFx0JHNjb3BlLmJvb2tzID0gQm9va3MuZ2V0QWxsQm9va3MoKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5mYWN0b3J5KCdCb29rJywgZnVuY3Rpb24gQm9va0ZhY3RvcnkoKSB7XHJcblxyXG4gICAgdmFyIEJvb2tGYWN0b3J5ID0gZnVuY3Rpb24ob2JqKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBvYmouaWQ7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IG9iai50aXRsZSB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuYXV0aG9yID0gYW5ndWxhci5pc0FycmF5KG9iai5hdXRob3IpID8gb2JqLmF1dGhvci5qb2luKCcsICcpIDogb2JqLmF1dGhvciB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBvYmouaW1hZ2UgfHwgJ2ltYWdlcy9Cb29rLmpwZyc7XHJcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IGFuZ3VsYXIuaXNBcnJheShvYmouY2F0ZWdvcnkpID8gb2JqLmNhdGVnb3J5LmpvaW4oJywgJykgOiBvYmouY2F0ZWdvcnkgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLnB1Ymxpc2hlciA9IG9iai5wdWJsaXNoZXIgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLnB1YmxpY2F0aW9uRGF0ZSA9IG9iai5wdWJsaWNhdGlvbkRhdGUgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IG9iai5sZW5ndGggfHwgbnVsbDtcclxuICAgICAgICB0aGlzLnJhdGUgPSBvYmoucmF0ZSB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBvYmouZGVzY3JpcHRpb24gfHwgbnVsbDtcclxuICAgICAgICB0aGlzLnJldmlldyA9IG9iai5yZXZpZXcgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLmFic3RyYWN0SXRlbXMgPSBvYmouYWJzdHJhY3RJdGVtcyB8fCBbXTtcclxuICAgICAgICB0aGlzLnF1b3Rlc0Ftb3VudCA9IG9iai5xdW90ZXNBbW91bnQgfHwgMDtcclxuICAgICAgICB0aGlzLm5vdGVzQW1vdW50ID0gb2JqLm5vdGVzQW1vdW50IHx8IDA7XHJcblxyXG4gICAgICAgIGlmICghb2JqLmFkZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkZWQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tb2RpZmllZCA9IG9iai5tb2RpZmllZCB8fCBuZXcgRGF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgY3VycmVudEJvb2tzID0gW107XHJcblxyXG4gICAgQm9va0ZhY3RvcnkucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpIHtcclxuICAgICAgICAgICAgY3VycmVudEJvb2tzID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRCb29rcy5wdXNoKHRoaXMpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdib29rcycsIGFuZ3VsYXIudG9Kc29uKGN1cnJlbnRCb29rcykpO1xyXG4gICAgfTtcclxuXHJcbiAgICBCb29rRmFjdG9yeS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgICBpc05ldyA9IHRydWU7XHJcbiAgICAgICAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSkge1xyXG4gICAgICAgICAgICB0aGF0LnNhdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdXJyZW50Qm9va3MgPSBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29rcycpKTtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGN1cnJlbnRCb29rcywgZnVuY3Rpb24ob2JqLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5pZCA9PSB0aGF0LmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRoYXQsIGZ1bmN0aW9uKHZhbHVlLCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcGVydHldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jvb2tzJywgYW5ndWxhci50b0pzb24oY3VycmVudEJvb2tzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNOZXcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChpc05ldykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5zYXZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIEJvb2tGYWN0b3J5LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAgIGN1cnJlbnRCb29rcyA9IGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChjdXJyZW50Qm9va3MsIGZ1bmN0aW9uKG9iaiwgaW5kZXgpIHtcclxuICAgICAgICAgICAgaWYgKG9iai5pZCA9PSB0aGF0LmlkKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Qm9va3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdib29rcycsIGFuZ3VsYXIudG9Kc29uKGN1cnJlbnRCb29rcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBCb29rRmFjdG9yeTtcclxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Jvb2ttYW4nKS5mYWN0b3J5KCdCb29rcycsIGZ1bmN0aW9uIEJvb2tzRmFjdG9yeSgkaHR0cCwgQm9vaykge1xyXG4gICAgdmFyIGZhY3RvcnkgPSB7fTtcclxuICAgIGZhY3RvcnkuZGVmYXVsdGNvdmVyID0gXCJpbWFnZXMvQm9vay5qcGdcIjtcclxuICAgIGZhY3RvcnkuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYm9va3MvdjEvdXNlcnMvMTE0ODczMjI5MjQwMzM2MzUwMTM0L2Jvb2tzaGVsdmVzLzAvdm9sdW1lc1wiKTtcclxuICAgICAgICBwcm9taXNlLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdmFyIGJvb2ssIGVsbSwgb2JqLCBhcHBCb29rcyA9IHJlc3BvbnNlLml0ZW1zO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBhcHBCb29rcykge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gYXBwQm9va3NbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgb2JqID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBlbG0uaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGVsbS52b2x1bWVJbmZvLnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvcjogZWxtLnZvbHVtZUluZm8uYXV0aG9ycyxcclxuICAgICAgICAgICAgICAgICAgICBwdWJsaXNoZXI6IGVsbS52b2x1bWVJbmZvLnB1Ymxpc2hlcixcclxuICAgICAgICAgICAgICAgICAgICBwdWJsaWNhdGlvbkRhdGU6IGVsbS52b2x1bWVJbmZvLnB1Ymxpc2hlZERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGVsbS52b2x1bWVJbmZvLmltYWdlTGlua3MgPyBlbG0udm9sdW1lSW5mby5pbWFnZUxpbmtzLnRodW1ibmFpbCA6IGZhY3RvcnkuZGVmYXVsdGNvdmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBlbG0udm9sdW1lSW5mby5jYXRlZ29yaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aDogZWxtLnZvbHVtZUluZm8ucGFnZUNvdW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBlbG0udm9sdW1lSW5mby5kZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYm9vayA9IG5ldyBCb29rKG9iaik7XHJcbiAgICAgICAgICAgICAgICBib29rLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGZhY3RvcnkuZ2V0QWxsQm9va3MgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICB9O1xyXG4gICAgZmFjdG9yeS5nZXRCb29rQnlJRCA9IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgdmFyIGJvb2tzID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va3MnKSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib29rcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoYm9va3NbaV0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYm9va3NbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBmYWN0b3J5O1xyXG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYm9va21hbicpXHJcbiAgICAuZmFjdG9yeSgnQnV0dG9ucycsIGZ1bmN0aW9uIEJ1dHRvbnNGYWN0b3J5KCkge1xyXG5cclxuICAgICAgICByZXR1cm4gQnV0dG9ucyA9IHtcclxuICAgICAgICAgICAgdG9nZ2xlVXJsQnRuOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkKCcjaW1hZ2UnKSxcclxuICAgICAgICAgICAgICAgICAgICAkYm94ID0gJCgnLmNvdmVyLWJveCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICRtZXNzYWdlID0gJGJveC5maW5kKCdzcGFuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJGlucHV0LnNob3coKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgJG1lc3NhZ2UuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgJGlucHV0Lm9uKCdmb2N1c291dCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghJGlucHV0LnZhbCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRtZXNzYWdlLmh0bWwoJ2FkZCBjb3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRtZXNzYWdlLmh0bWwoJ2NoYW5nZSBjb3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkbWVzc2FnZS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0LmhpZGUoKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzaG93U2hvcnRJbmZvOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICRidG4gPSAkKGUudGFyZ2V0KSxcclxuICAgICAgICAgICAgICAgICAgICAkYm9vayA9ICRidG4uY2xvc2VzdCgnLmJvb2staW5zdGFuY2UnKSxcclxuICAgICAgICAgICAgICAgICAgICAkYm94ID0gJGJ0bi5jbG9zZXN0KCcuYm9vay1pbnN0YW5jZScpLmZpbmQoJy5tb3JlLWluZm8tYm94Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJGJveC50b2dnbGVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAkYm9vay5vbignZm9jdXNvdXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkYm94LnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pOyJdLCJzb3VyY2VSb290IjoiL3NjcmlwdHMifQ==