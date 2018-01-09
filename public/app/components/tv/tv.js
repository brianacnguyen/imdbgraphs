angular.module('app.components.tv', ['app.components.graph'])
    .controller("TVController", function($scope, $stateParams, TMDBAPI, OMDBAPI, TVGraph) {
        $scope.currentTVShow = {};
        $scope.currentTVShow = TVGraph.initializeTVShowDefaults($scope.currentTVShow);
        $scope.currentTVDetail = {};
        var getTVRatings = function(imdbID, resultsObj, currentSeason) {
            currentSeason = currentSeason || 1;
            if (currentSeason <= $scope.currentTVShow.seasonCount) {
                OMDBAPI.getTVSeasonRatings(imdbID, currentSeason).then(function(resp) {
                    if (!resultsObj['Seasons']) {
                        resultsObj['Title'] = resp['Title'];
                        resultsObj['Seasons'] = {};
                    }
                    // console.log(resp)
                    resultsObj['Seasons'][currentSeason.toString()] = resp["Episodes"];
                    $scope.currentTVShow.seasonCount = parseInt(resp["totalSeasons"]);
                    currentSeason = parseInt(resp["Season"]);
                    getTVRatings(imdbID, resultsObj, currentSeason + 1)
                    $scope.currentTVShow = resultsObj;
                    if (currentSeason == $scope.currentTVShow.seasonCount) {
                        TVGraph.drawGraph($scope.currentTVShow);
                    }
                })
            }
        }
        TMDBAPI.getTVExternalIds($stateParams.tmdbID).then(function(resp) {
                var imdbID = resp.data.external_ids.imdb_id;
                $scope.currentTVDetail = resp.data;
                getTVRatings(imdbID, {});
            })
    })

