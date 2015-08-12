 angular.module('bookman', ['ngRoute'])
     .factory('Book', function BookFactory() {
         var BookFactory = function (obj) {
             this._id = obj.id;
             this._title = obj.title;
             this._authors = obj.authors;
             this._image = obj.image;
         };
         var customBooks = [];
         BookFactory.prototype.save = function () {
             if (sessionStorage.getItem('books')) {
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
