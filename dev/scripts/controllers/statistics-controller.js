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