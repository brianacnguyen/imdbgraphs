var TMDB_API_PATH = "https://api.themoviedb.org/3/"



var TMDB_API_KEY_PARAMS = "api_key=";
var TMDB_API_KEY = "b0f14755c68c952523db6a679351878c";



var TMDB_MULTI_SEARCH_PATH = "search/multi?language=en-US&include_adult=false";
var TMDB_COLLECTION_SEARCH_PATH = "search/collection?language=en-US";
var TMDB_SEARCH_PARAMS = "query=";



var TMDB_TV_PATH = "tv/";



var TMDB_PERSON_PATH = "person/";
var TMDB_PERSON_COMBINEDCREDITS_PATH = "/combined_credits";



var TMDB_MOVIE_PATH = "movie/";
var TMDB_EXTERNAL_IDS_PARAMS = "append_to_response=external_ids";
var TMDB_CONFIGURATION_PATH = "https://api.themoviedb.org/3/configuration?";

angular.module('app.api.tmdb', [])
    .factory('TMDBAPI', function($http, $rootScope) {
        var getImageConfiguration = function() {
            var getURL = TMDB_CONFIGURATION_PATH + TMDB_API_KEY_PARAMS + TMDB_API_KEY;
            $rootScope.tmdbConfigurations = {};
            return $http({
                    method: 'GET',
                    url: getURL
                })
                .then(function(resp) {
                    $rootScope.tmdbConfigurations = resp.data;
                });
        }
        var getMultiSearch = function(query) { 
            var getURL = TMDB_API_PATH + TMDB_MULTI_SEARCH_PATH + "&" + TMDB_API_KEY_PARAMS + TMDB_API_KEY + "&" + TMDB_SEARCH_PARAMS + query;
            return $http({
                    method: 'GET',
                    url: getURL
                })
                .then(function(resp) {
                    return resp.data;
                });
        }
        var getCollectionSearch = function(query) {
            var getURL = TMDB_API_PATH + TMDB_COLLECTION_SEARCH_PATH + "&" + TMDB_API_KEY_PARAMS + TMDB_API_KEY + "&" + TMDB_SEARCH_PARAMS + query;
            return $http({
                    method: 'GET',
                    url: getURL
                })
                .then(function(resp) {
                    return resp.data;
                });
        }
        var getTVExternalIds = function(tmdbID) {
            var getURL = TMDB_API_PATH + TMDB_TV_PATH + tmdbID + "?" + TMDB_API_KEY_PARAMS + TMDB_API_KEY + "&" + TMDB_EXTERNAL_IDS_PARAMS;
            return $http({
                    method: 'GET',
                    url: getURL
                })
                .then(function(resp) {
                    return resp;
                });
        }
        var getPersonDetails = function(tmdbID) {
            var getURL = TMDB_API_PATH + TMDB_PERSON_PATH + tmdbID + "?" + TMDB_API_KEY_PARAMS + TMDB_API_KEY;
            return $http({
                    method: 'GET',
                    url: getURL
                })
                .then(function(resp) {
                    return resp;
                });
        }
        var getPersonCombinedCredits = function(tmdbID) {
            var getURL = TMDB_API_PATH + TMDB_PERSON_PATH + tmdbID + TMDB_PERSON_COMBINEDCREDITS_PATH + "?" + TMDB_API_KEY_PARAMS + TMDB_API_KEY;
            return $http({
                    method: 'GET',
                    url: getURL
                })
                .then(function(resp) {
                    return resp;
                });
        }
        var getMovieDetails = function(tmdbID) {
            var getURL = TMDB_API_PATH + TMDB_MOVIE_PATH + tmdbID + "?" + TMDB_API_KEY_PARAMS + TMDB_API_KEY;
            return $http({
                    method: 'GET',
                    url: getURL
                })
                .then(function(resp) {
                    return resp;
                });
        }
        getImageConfiguration();
        return {
            getMultiSearch: getMultiSearch,
            getCollectionSearch: getCollectionSearch,
            getTVExternalIds: getTVExternalIds,
            getImageConfiguration: getImageConfiguration,
            getPersonDetails: getPersonDetails,
            getPersonCombinedCredits: getPersonCombinedCredits,
            getMovieDetails: getMovieDetails
        };
    })

