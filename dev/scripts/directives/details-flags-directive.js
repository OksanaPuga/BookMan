angular.module('bookman')
    .directive('detailsFlags', function() {

        return {
            restrict: 'A',
            templateUrl: 'templates/directives/details-flags.html',
            controller: function($routeParams) {
                return {
                    infoUrl: '#/books/' + $routeParams.id + '/info',
                    contentUrl: '#/books/' + $routeParams.id + '/content',
                    abstractUrl: '#/books/' + $routeParams.id + '/abstract'
                };
            },
            controllerAs: 'flagsCtrl'
        }

    });