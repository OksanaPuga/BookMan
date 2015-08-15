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
            this.author = obj.author;
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
        this.description = obj.description || null;
        this.review = obj.review || null;
        this.abstractItems = obj.abstractItems || [];
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
