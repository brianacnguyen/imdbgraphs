angular.module('app.components.search', [])
    .controller("SearchController", function($scope, $location, $state, TMDBAPI, SearchServices) {
        $scope.query = "";
        $scope.tvResults = [];
        $scope.searchSubmit = function(query) {
            $location.path('/search/' + query);
        }
        $scope.searchChange = function(query){
            if (query) {
                TMDBAPI.getMultiSearch(query).then(function(resp) {
                    var results = resp.results;
                    $scope.tvResults = SearchServices.filterTVResults(results);
                })
            } else {
                $scope.tvResults = [];
            }
        }
        $scope.resultSelected = function(tmdbID) {
            $location.path('/tv/' + tmdbID)
        }
        $scope.currentPage = $state.current.name;
    })
