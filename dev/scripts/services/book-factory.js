angular.module('bookman').factory('Book', function BookFactory() {

    var BookFactory = function (obj) {

        this.id = obj.id;
        if (obj.title) {
            this.title = obj.title;
        }
        if (obj.author) {
            if (angular.isArray(obj.author)){
                this.author = obj.author.join(', ');
            } else {
                this.author = obj.author;
            }
        }
        if (obj.image) {
            this.image = obj.image;
        }
        if (obj.category) {
            if (angular.isArray(obj.category)){
                this.category = obj.author.join(', ');
            } else {
                this.category = obj.author;
            }
        }
        if (obj.publisher) {
            this.publisher = obj.publisher;
        }
        if (obj.publicationDate) {
            this.publicationDate = obj.publicationDate;
        }
        if (obj.length) {
            this.length = obj.length;
        }
        if (obj.description) {
            this.description = obj.description;
        }
        if (obj.review) {
            this.review = obj.review;
        }
        if (obj.abstractItems) {
            this.abstractItems = obj.abstractItems;
        }
       
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
