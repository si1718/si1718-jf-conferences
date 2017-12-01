/* global angular */
/* global Highcharts*/
angular.module("DataManagementApp")
    .controller("Integration2Ctrl", ["$scope", "$http", "$location", "$routeParams", function($scope, $http, $location, $routeParams) {
        console.log("Controller initialized (Integration2Ctrl)");

        $scope.data = {};
        var dataCache = {};

        $scope.idConference = [];
        $scope.conference = [];
        $scope.acronym = [];
        $scope.edition = [];
        $scope.city = [];
        $scope.country = [];
        $scope.conference1 = [];

        $http.get("https://si1718-nlg-papers.herokuapp.com/papers?conferenceName").then(function(response) {
            

           // $http.get("https://si1718-nlg-papers.herokuapp.com/papers").then(function(response) {

        });

    }]);
