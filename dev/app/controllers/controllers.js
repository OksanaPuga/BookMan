  bookmanan.controller('BooksController', ['$scope', 'BooksFactory', 'BookFactory', function ($scope, BooksFactory, BookFactory) {
    //sessionStorage.clear();
    BooksFactory.getAppBooks().success(function(response) {
     var book, elm,obj,appBooks = response.items;
      for ( var property in appBooks ) {
        elm = appBooks[property];
        obj = {
          id: elm.id,
          title: elm.volumeInfo.title,
          authors: elm.volumeInfo.authors,
          image: elm.volumeInfo.imageLinks.thumbnail
        }
        book = new BookFactory(obj);
        book.save(); 
      }

      $scope.books =  BooksFactory.getAllBooks();
    });
  

  }])
  
  bookmanan.controller('BooksDetailController', ['$scope', '$routeParams', 'BooksFactory', function ($scope, $routeParams, BooksFactory) {
    $scope.book = BooksFactory.getBookByID($routeParams.id);
  }])