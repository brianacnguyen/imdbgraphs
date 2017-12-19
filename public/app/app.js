angular.module("app", [
    'ui.router',
    'app.services',
    'app.api.tmdb',
    'app.components.search',
])
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state("search", {
            templateUrl: "/app/components/search/search.html",
            url: "/",
            controller: "SearchController"
        })
})
