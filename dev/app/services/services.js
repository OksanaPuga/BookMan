 bookmanan.factory('BooksFactory', function($http) { 
    var factory = {},
        allBooks = [];
    factory.getAppBooks = function () {
      return  $http.get("https://www.googleapis.com/books/v1/users/114873229240336350134/bookshelves/0/volumes")     
    };
    factory.getAllBooks = function () {     
      return angular.fromJson(sessionStorage.getItem('books'));   
    };
    factory.getBookByID = function(id) {
      var books = angular.fromJson(sessionStorage.getItem('books'));
      console.log(books[id]);
      return books[id]
    };
    return factory;
  });

  bookmanan.factory('BookFactory',function(){
    var BookFactory = function(obj){
      this._id = obj.id;
      this._title = obj.title;
      this._authors = obj.authors;
      this._image = obj.image;
    };
    var customBooks = [];
    BookFactory.prototype.save = function (){ 
      if (sessionStorage.getItem('books')){
        customBooks = angular.fromJson(sessionStorage.getItem('books'));
      }      
      customBooks.push(this);
      sessionStorage.setItem('books', angular.toJson(customBooks));    
    };
    BookFactory.prototype.update = function () {
      console.log('update');
    };
    BookFactory.prototype.delete = function () {
     console.log('delete');
    };
    return BookFactory;
    })