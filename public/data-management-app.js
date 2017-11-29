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
        });
       
    console.log("App initialized and configured");
});