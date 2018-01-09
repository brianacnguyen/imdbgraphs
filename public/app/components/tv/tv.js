angular.module('app.components.tv', ['app.components.graph'])
    .controller("TVController", function($scope, $stateParams, TMDBAPI, OMDBAPI, TVGraph) {
        var currentTVShow = {};
        currentTVShow = TVGraph.initializeTVShowDefaults(currentTVShow);
        $scope.currentTVDetail = {};
        $scope.loading = false;
        $scope.loadingMessage = "Loading...";
        var getTVRatings = function(imdbID, currentSeason) {
            currentSeason = currentSeason || 1;
            if (currentSeason <= currentTVShow.seasonCount) {
                OMDBAPI.getTVSeasonRatings(imdbID, currentSeason).then(function(resp) {
                    if (!currentTVShow['Seasons']) {
                        currentTVShow['Title'] = resp['Title'];
                        currentTVShow['Seasons'] = {};
                    }
                    // console.log(resp)
                    currentTVShow['Seasons'][currentSeason.toString()] = resp["Episodes"];
                    currentTVShow.seasonCount = Number(resp["totalSeasons"]);
                    currentSeason = Number(resp["Season"]);
                    if (currentSeason == currentTVShow.seasonCount) {
                        $scope.loading = false;
                        $scope.loadingMessage = "Loading...";
                        TVGraph.drawGraph(currentTVShow);
                    } else {
                        $scope.loading = true;
                        $scope.loadingMessage = "Now loading data for season " + (currentSeason + 1) + "...";
                        getTVRatings(imdbID, currentSeason + 1)
                    }
                })
            }
        }
        TMDBAPI.getTVExternalIds($stateParams.tmdbID).then(function(resp) {
                var imdbID = resp.data.external_ids.imdb_id;
                $scope.currentTVDetail = resp.data;
                getTVRatings(imdbID);
            })
    })

