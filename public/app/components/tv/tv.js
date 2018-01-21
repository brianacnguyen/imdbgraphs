angular.module('app.components.tv', ['app.components.graph'])
    .controller("TVController", function($scope, $stateParams, TMDBAPI, OMDBAPI, TVGraph) {
        $scope.currentTVShow = {
            name: "",
            overview: "",
            backdrop: "",
            episodes: [],
            xAxisLabels: [],
            xAxisIds: [],
            sortedRatings: [],
            totalEpisodes: 0,
            totalSeasons: 0
        };
        $scope.loading = false;
        $scope.loadingMessage = "Loading...";
        $scope.percentLoaded = 0;
        var episodeId = 1;
        var getTVRatings = function(imdbID, currentSeasonNumber) {
            currentSeasonNumber = currentSeasonNumber || 1;
            if (currentSeasonNumber <= $scope.currentTVShow.totalSeasons) {
                OMDBAPI.getTVSeasonRatings(imdbID, currentSeasonNumber).then(function(resp) {
                    currentSeasonNumber = Number(resp["Season"]);
                    var episodes = resp["Episodes"];
                    episodes.forEach(function(episode, index) {
                        var rating = parseFloat(episode["imdbRating"]);
                        if (!isNaN(rating)) {
                            var episodeNumber = parseInt(episode["Episode"]);
                            var episodeTitle = episode["Title"];
                            if (index == 0) {
                                $scope.currentTVShow.xAxisIds.push(episodeId);
                                $scope.currentTVShow.xAxisLabels.push(currentSeasonNumber);
                            }
                            var episodeObj = {
                                id: episodeId,
                                rating: rating,
                                title: episodeTitle,
                                seasonNumber: currentSeasonNumber,
                                episodeNumber: episodeNumber
                            }
                            $scope.currentTVShow.episodes.push(episodeObj);
                            episodeId++;
                        }
                    })
                    if (currentSeasonNumber == $scope.currentTVShow.totalSeasons) {
                        $scope.loading = false;
                        $scope.loadingMessage = "Loading...";
                        $scope.currentTVShow.sortedRatings = $scope.currentTVShow.episodes.slice(0).sort(function(a,b) {
                                return a.rating - b.rating;
                        })
                        TVGraph.drawGraph($scope.currentTVShow);
                    } else {
                        $scope.loading = true;
                        $scope.loadingPercent = Math.floor($scope.currentTVShow.episodes.length * 100 / $scope.currentTVShow.totalEpisodes);
                        $scope.loadingMessage = "Loading..." + $scope.loadingPercent + "%";
                        getTVRatings(imdbID, currentSeasonNumber + 1)
                    }
                })
            }
        }
        TMDBAPI.getTVExternalIds($stateParams.tmdbID).then(function(resp) {
                var imdbID = resp.data.external_ids.imdb_id;
                $scope.currentTVShow.name = resp.data['name'];
                $scope.currentTVShow.overview = resp.data['overview'];
                $scope.currentTVShow.backdrop = resp.data['backdrop_path'];
                $scope.currentTVShow.totalEpisodes = resp.data['number_of_episodes'];
                $scope.currentTVShow.totalSeasons = resp.data['number_of_seasons'];
                getTVRatings(imdbID);
            })
    })

