/* global angular */
angular.module("DataManagementApp", ["ngRoute"]).config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "main.html"
        })
        .when("/conferences", {
            templateUrl: "list.html",
            controller: "ListCtrl"
        })
        .when("/edit/:idConference", {
            templateUrl: "edit.html",
            controller: "EditCtrl"
        })
        .when("/analytics", {
            templateUrl: "analytics.html",
            controller: "AnalyticsCtrl"
        })
        .when("/integrations", {
            templateUrl: "integration1.html",
            controller: "Integration1Ctrl"
        })
        .when("/integrations", {
            templateUrl: "integration2.html",
            controller: "Integration2Ctrl"
        });
       
    console.log("App initialized and configured");
});