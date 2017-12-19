angular.module("app", [
    'ui.router',
    'app.api.tmdb',
    'app.api.omdb',
    'app.services',
    'app.components.search',
    'app.components.tv',
])
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state("search", {
            templateUrl: "/app/components/search/search.html",
            url: "/",
            controller: "SearchController"
        })
        .state("tv", {
            templateUrl: "/app/components/tv/tv.html",
            url: "/tv/{imdbID}",
            controller: "TVController"
        })
})
