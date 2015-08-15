angular.module('bookman')
    .directive('editDeleteBtn', function () {

        return {
            restrict: 'E',
            templateUrl: 'templates/directives/edit-delete-btn.html',
            controller: function ($routeParams) {
                return {
                    editPageUrl: '#/books/' + $routeParams.id + '/edit'
                };
            },
            controllerAs: 'editDelCtrl'
        }

    });
