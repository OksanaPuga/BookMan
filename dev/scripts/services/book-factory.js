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