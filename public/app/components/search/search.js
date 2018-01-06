angular.module('app.components.search', [])
    .controller("SearchController", function($scope, $location, $state, TMDBAPI, SearchServices) {
        $scope.query = "";
        $scope.tvResults = [];
        $scope.searchSubmit = function(query) {
            $location.path('/search/' + query);
        }
        $scope.searchChange = function(query){
            TMDBAPI.getMultiSearch(query).then(function(resp) {
                var results = resp.results;
                $scope.tvResults = SearchServices.filterTVResults(results);
            })
        }
        $scope.resultSelected = function(tmdbID) {
            TMDBAPI.getTVExternalIds(tmdbID).then(function(resp) {
                var imdbID = resp.imdb_id;
                $location.path('/tv/' + imdbID)
            })
        }
        $scope.currentPage = $state.current.name;
    })
