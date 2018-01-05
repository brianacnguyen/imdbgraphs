angular.module("app", [
    'ui.router',
    'app.api.tmdb',
    'app.api.omdb',
    'app.services',
    'app.components.search',
    'app.components.searchresults',
    'app.components.graph',
    'app.components.tv',
])
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state("home", {
            url: "/",
            views: {
                "intro": {
                    templateUrl: "/app/components/intro/intro.html",
                },
                "searchBar": {
                    templateUrl: "/app/components/search/search.html",
                    controller: "SearchController"
                }
            }
        })
        .state("search", {
            url:"/search/{query}",
            views: {
                "searchBar": {
                    templateUrl: "/app/components/search/search.html",
                    controller: "SearchController"
                },
                "searchResults": {
                    templateUrl: "/app/components/searchResults/searchResults.html",
                    controller: "SearchResultsController"
                },
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
