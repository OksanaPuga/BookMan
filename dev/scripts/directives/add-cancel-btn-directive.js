angular.module('bookman')
    .directive('addCancelBtn', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/add-cancel-btn.html'
        };
    });
