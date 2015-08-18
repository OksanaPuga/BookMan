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
