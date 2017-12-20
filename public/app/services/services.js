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
            if (currentSeason <= totalSeasons) {
                OMDBAPI.getTVSeasonRatings(imdbID, currentSeason).then(function(resp) {
                    resultsObj['Title'] = resp['Title'];
                    if (!resultsObj['Seasons']) {
                        resultsObj['Seasons'] = {};
                    }
                    resultsObj['Seasons'][currentSeason.toString()] = resp["Episodes"];
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
