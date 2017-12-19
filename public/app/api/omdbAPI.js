var API_PATH = "http://www.omdbapi.com/?";
var API_KEY_PARAMS = "apikey=";
var API_KEY = "a2798ed6";
var IMDBID_PARAMS = "i=";
var SEASON_PARAMS = "Season=";

angular.module('app.api.omdb', [])
    .factory('OMDBAPI', function($http) {

        var getTVSeasonRatings = function(imdbID, seasonNumber) {
            seasonNumber = seasonNumber || 1;
            var getURL = API_PATH + API_KEY_PARAMS + API_KEY + "&" + IMDBID_PARAMS + imdbID + "&" + SEASON_PARAMS + seasonNumber;
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
