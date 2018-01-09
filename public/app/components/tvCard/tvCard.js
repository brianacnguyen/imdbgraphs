angular.module("app.components.tvCard", [])
    .controller("TVCardController", function($scope, $location, TMDBAPI) {
        $scope.resultSelected = function(tmdbID) {
            TMDBAPI.getTVExternalIds(tmdbID).then(function(resp) {
                var imdbID = resp.imdb_id;
                $location.path('/tv/' + imdbID)
            })
        }
    })
    .directive("tvCard", function() {
        return {
            restrict: "EA",
            scope: {
                click : "&",
                fullimageurl: "@",
                imageurl: "@",
                name: "@",
                overview: "@",
            }, 
            templateUrl: "/app/components/tvCard/tvCard.html"
        }
    })
