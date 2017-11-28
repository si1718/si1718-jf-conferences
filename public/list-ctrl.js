/* global angular */
/* global Materialize */
/* global $ */
angular.module("DataManagementApp")
    .controller("ListCtrl", ["$scope", "$http", "$location", "$routeParams", function($scope, $http, $location, $routeParams) {
        console.log("Controller initialized (ListCtrl)");

        // $scope.search = {};
        // $scope.searchAdd = {};
        console.log($routeParams);
        $scope.data = {};

        function refresh() {
            $http
                .get("/api/v1/conferences")
                .then(function(response) {
                    $scope.conferences = response.data;
                });

            // $scope.newConferences = {
            //     idConference: "caise-2017",
            //     conference: "Conference on Advanced Information Systems Engineering",
            //     acronym: "CAISE",
            //     edition: "2017",
            //     city: "Essen",
            //     country: "Germany"
            // }
        }

        $scope.loadInitialData = function() {
            refresh();
            if ($scope.data.length == 0) {
                $http
                    .get("/api/v1/conferences/loadInitialData")
                    .then(function(response) {
                        console.log("Initial data loaded");
                        Materialize.toast('<i class="material-icons">done</i> Loaded initial data succesfully!', 4000);
                        refresh();
                    }, function(response) {
                        Materialize.toast('<i class="material-icons">error_outline</i> Error adding initial data!', 4000);
                    });
            }
            else {
                Materialize.toast('<i class="material-icons">error_outline</i> List must be empty to add initial data!', 4000);
                console.log("List must be empty!");
            }
        };

        $scope.searchConference = function() {
            console.log("Data founded");
            $http({
                    url: "/api/v1/conferences",
                    params: $routeParams
                })
                .then(function(response) {
                    $scope.conferences = response.data;
                });
        }

        $scope.addConference = function() {

            $http
                .post("/api/v1/conferences/", $scope.newConference)
                .then(function(response) {
                    console.log("Data added");
                    Materialize.toast('<i class="material-icons">done</i> ' + $scope.newConference.idConference + ' has been added succesfully!', 4000);
                    refresh();
                }, function(error) {
                    switch (error.status) {
                        case 400:
                            Materialize.toast('<i class="material-icons">error_outline</i> Error adding data - incorrect data was entered!', 4000);
                            break;
                        case 409:
                            Materialize.toast('<i class="material-icons">error_outline</i> Error adding data - the data already exists!', 4000);
                            break;
                        case 422:
                            Materialize.toast('<i class="material-icons">error_outline</i> Error adding data - some field is wrong!', 4000);
                            break;
                        default:
                            Materialize.toast('<i class="material-icons">error_outline</i> Error adding data!', 4000);
                            break;
                    }
                });

        };

        $scope.deleteConference = function(idConference) {

            $http
                .delete("/api/v1/conferences/" + idConference)
                .then(function(response) {
                    console.log("Data deleted");
                    Materialize.toast('<i class="material-icons">done</i> ' + idConference + ' has been deleted succesfully!', 4000);
                    refresh();
                }, function(error) {
                    Materialize.toast('<i class="material-icons">error_outline</i> Error deleting data!', 4000);
                });

        };

        $scope.deleteAllConferences = function() {

            $http
                .delete("/api/v1/conferences/")
                .then(function(response) {
                    console.log("All data deleted");
                    Materialize.toast('<i class="material-icons">done</i> All data has been deleted succesfully!', 4000);
                    refresh();
                }, function(error) {
                    Materialize.toast('<i class="material-icons">error_outline</i> Error deleting all data!', 4000);
                });
        };

        // $('#searchModal').modal({
        //     complete: function() {
        //         modifier = "";
        //         properties = ""; 
        //         if ($scope.search.idConference) {
        //             modifier = "/" + $scope.search.idConference;
        //         }

        //         for (var prop in $scope.searchAdd) {
        //             if ($scope.searchAdd.hasOwnProperty(prop) && prop) {
        //                 properties += prop + "=" + $scope.searchAdd[prop] + "&";
        //             }
        //         }

        //         refresh();
        //     }
        // });

        refresh();
    }]);
