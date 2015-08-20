angular.module('bookman')
    .factory('Buttons', function ButtonsFactory() {

        return Buttons = {
            toggleUrlBtn: function () {
                var $input = $('#image'),
                    $box = $('.cover-box'),
                    $message = $box.find('span');

                $input.show().focus();
                $message.hide();
                $input.on('focusout', function () {
                    if (!$input.val()) {
                        $message.html('add cover');
                    } else {
                        $message.html('change cover');
                    }
                    $message.show();
                    $input.hide()
                });
            },
            
            showShortInfo: function (e) {
                e.preventDefault();

                var $btn = $(e.target),
                    $book = $btn.closest('.book-instance'),
                    $box = $btn.closest('.book-instance').find('.more-info-box');
                
                $box.toggleClass('opened');
                $book.on('focusout', function () {
                    $box.removeClass('opened');
                });
            }
        }

    });
