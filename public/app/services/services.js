angular.module('app.services', [])
    .factory('SearchServices', function() {
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
    .factory('TvServices', function(OMDBAPI) {
        var getTVRatings = function(imdbID, resultsObj, currentSeason, totalSeasons) {
            currentSeason = currentSeason || 1;
            totalSeasons = totalSeasons || 1;
            console.log(currentSeason);
            if (currentSeason <= totalSeasons) {
                OMDBAPI.getTVSeasonRatings(imdbID, currentSeason).then(function(resp) {
                    resultsObj[currentSeason.toString()] = resp["Episodes"];
                    totalSeasons = parseInt(resp["totalSeasons"]);
                    currentSeason = parseInt(resp["Season"]);
                    getTVRatings(imdbID, resultsObj, currentSeason + 1, totalSeasons)
                })
            }
        }
        return {
            getTVRatings: getTVRatings
        };
    })
