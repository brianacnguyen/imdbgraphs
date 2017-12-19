angular.module('app.components.search', [])
    .controller("SearchController", function($scope, TMDBAPI, searchServices) {
        angular.extend($scope, TMDBAPI);
        $scope.query = "";
        $scope.tvResults = [];
        $scope.peopleResults = [];
        $scope.searchSubmit = function(query) {
            TMDBAPI.getMultiSearch(query).then(function(resp) {
                var results = resp.results;
                $scope.tvResults = searchServices.filterTVResults(results);
            })
        }
        $scope.resultSelected = function(tmdbID) {
            TMDBAPI.getTVExternalIds(tmdbID).then(function(resp) {
                var imdbID = resp.imdb_id;
                console.log(imdbID);
            })
        }
    })
