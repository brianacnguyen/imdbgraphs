angular.module('app.components.search', [])
    .controller("SearchController", function($scope, $location, $state, $stateParams, TMDBAPI, SearchServices) {
        $scope.query = "";
        $scope.tvResults = [];
        $scope.searchSubmit = function(query) {
            $location.path('/search/' + query);
        }
        var searchTimeout = null;
        $scope.searchChange = function(query){
            if (query) {
                if (searchTimeout) {
                    clearTimeout(searchTimeout)
                }
                searchTimeout = setTimeout(function(){
                    TMDBAPI.getMultiSearch(query).then(function(resp) {
                        var results = resp.results;
                        $scope.tvResults = SearchServices.filterTVResults(results);
                    })
                }, 500)
            } else {
                $scope.tvResults = [];
            }
        }
        $scope.resultSelected = function(tmdbID) {
            if ($stateParams.tmdbID == tmdbID) {
                $state.reload();
            } else {
                $location.path('/tv/' + tmdbID)
            }
        }
        $scope.currentPage = $state.current.name;
    })
