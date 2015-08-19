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
