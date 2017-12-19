var API_PATH = "https://api.themoviedb.org/3/"
var API_KEY_PARAMS = "api_key=";
var API_KEY = "b0f14755c68c952523db6a679351878c";
var MULTI_SEARCH_PATH = "search/multi?language=en-US&include_adult=false";
var COLLECTION_SEARCH_PATH = "search/collection?language=en-US";
var SEARCH_PARAMS = "query=";
var TV_PATH = "tv/";
var EXTERNAL_IDS_PARAMS = "append_to_response=external_ids";


angular.module('app.api.tmdb', [])
    .factory('TMDBAPI', function($http) {
        var getMultiSearch = function(query) { 
            var getURL = API_PATH + MULTI_SEARCH_PATH + "&" + API_KEY_PARAMS + API_KEY + "&" + SEARCH_PARAMS + query;
            return $http({
                    method: 'GET',
                    url: getURL
                })
                .then(function(resp) {
                    return resp.data;
                });
        }
        var getCollectionSearch = function(query) {
            var getURL = API_PATH + COLLECTION_SEARCH_PATH + "&" + API_KEY_PARAMS + API_KEY + "&" + SEARCH_PARAMS + query;
            return $http({
                    method: 'GET',
                    url: getURL
                })
                .then(function(resp) {
                    return resp.data;
                });
        }
        var getTVExternalIds = function(tmdbID) {
            var getURL = API_PATH + TV_PATH + tmdbID + "?" + API_KEY_PARAMS + API_KEY + "&" + EXTERNAL_IDS_PARAMS;
            return $http({
                    method: 'GET',
                    url: getURL
                })
                .then(function(resp) {
                    return resp.data.external_ids;
                });
        }
        return {
            getMultiSearch: getMultiSearch,
            getCollectionSearch: getCollectionSearch,
            getTVExternalIds: getTVExternalIds
        };
    })

