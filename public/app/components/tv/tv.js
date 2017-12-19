angular.module('app.components.tv', [])
    .controller("TVController", function($scope, $stateParams, TvServices) {
        angular.extend($scope, TvServices);
        $scope.tvRatings = {};
        TvServices.getTVRatings($stateParams.imdbID, $scope.tvRatings);
    })
