angular.module('app.services', [])

    .factory('searchServices', function($http) {
        var filterTVResults = function(results) {
            console.log(results);
            return results.filter(function(result){
                return result.media_type == "tv";
            })
        } 
        return {
            filterTVResults: filterTVResults
        };
    })
