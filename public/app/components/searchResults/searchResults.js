angular.module('app.components.searchresults', [])
    .controller("SearchResultsController", function($scope, $stateParams, $location, TMDBAPI, SearchServices, $rootScope) {
        $scope.tvResults = [];
        $scope.peopleResults = [];
        TMDBAPI.getMultiSearch($stateParams.query).then(function(resp) {
            var results = resp.results;
            $scope.tvResults = SearchServices.filterTVResults(results);
        })
        $scope.resultSelected = function(tmdbID) {
            $location.path('/tv/' + tmdbID)
        }
    })

