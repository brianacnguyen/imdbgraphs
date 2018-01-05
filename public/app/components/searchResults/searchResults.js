angular.module('app.components.searchresults', [])
    .controller("SearchResultsController", function($scope, $stateParams, $location, TMDBAPI, SearchServices) {
        $scope.tvResults = [];
        $scope.peopleResults = [];
        TMDBAPI.getMultiSearch($stateParams.query).then(function(resp) {
            var results = resp.results;
            $scope.tvResults = SearchServices.filterTVResults(results);
        })
        $scope.resultSelected = function(tmdbID) {
            TMDBAPI.getTVExternalIds(tmdbID).then(function(resp) {
                var imdbID = resp.imdb_id;
                $location.path('/tv/' + imdbID)
            })
        }
    })

