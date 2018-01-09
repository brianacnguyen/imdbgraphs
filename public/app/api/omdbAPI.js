var OMDB_API_PATH = "https://www.omdbapi.com/?";
var OMDB_API_KEY_PARAMS = "apikey=";
var OMDB_API_KEY = "a2798ed6";
var OMDB_IMDBID_PARAMS = "i=";
var OMDB_SEASON_PARAMS = "Season=";

angular.module('app.api.omdb', [])
    .factory('OMDBAPI', function($http) {
        var getTVSeasonRatings = function(imdbID, seasonNumber) {
            var getURL = OMDB_API_PATH + OMDB_API_KEY_PARAMS + OMDB_API_KEY + "&" + OMDB_IMDBID_PARAMS + imdbID + "&" + OMDB_SEASON_PARAMS + seasonNumber;
            return $http({
                    method: 'GET',
                    url: getURL
                })
                .then(function(resp) {
                    return resp.data;
                });
        }

        return {
            getTVSeasonRatings: getTVSeasonRatings
        };
    })
