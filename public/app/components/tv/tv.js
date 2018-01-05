angular.module('app.components.tv', ['app.components.graph'])
    .controller("TVController", function($scope, $stateParams, OMDBAPI, TVGraph) {
        var currentTVShow = {};
        currentTVShow = TVGraph.initializeTVShowDefaults(currentTVShow);
        var getTVRatings = function(imdbID, resultsObj, currentSeason) {
            currentSeason = currentSeason || 1;
            if (currentSeason <= currentTVShow.seasonCount) {
                OMDBAPI.getTVSeasonRatings(imdbID, currentSeason).then(function(resp) {
                    if (!resultsObj['Seasons']) {
                        resultsObj['Title'] = resp['Title'];
                        resultsObj['Seasons'] = {};
                    }
                    resultsObj['Seasons'][currentSeason.toString()] = resp["Episodes"];
                    currentTVShow.seasonCount = parseInt(resp["totalSeasons"]);
                    currentSeason = parseInt(resp["Season"]);
                    getTVRatings(imdbID, resultsObj, currentSeason + 1)
                    currentTVShow = resultsObj;
                    if (currentSeason == currentTVShow.seasonCount) {
                        TVGraph.drawGraph(currentTVShow);
                    }
                })
            }
        }
        getTVRatings($stateParams.imdbID, {});
    })

