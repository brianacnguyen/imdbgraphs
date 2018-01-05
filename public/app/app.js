angular.module("app", [
    'ui.router',
    'app.api.tmdb',
    'app.api.omdb',
    'app.services',
    'app.components.search',
    'app.components.graph',
    'app.components.tv',
])
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state("home", {
            url: "/",
            views: {
                "searchBar": {
                    templateUrl: "/app/components/search/search.html",
                    controller: "SearchController"
                }
            }
        })
        .state("tv", {
            url: "/tv/{imdbID}",
            views: {
                "searchBar": {
                    templateUrl: "/app/components/search/search.html",
                    controller: "SearchController"
                },
                "tvGraph" : {
                    templateUrl: "/app/components/tv/tv.html",
                    controller: "TVController"
                }
            }
        })
})
