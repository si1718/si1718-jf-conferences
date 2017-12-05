/* global angular */
/* global toastr */

angular.module("DataManagementApp")
    .controller("ListCtrl", ["$scope", "$http", "$location", "$routeParams", function($scope, $http, $location, $routeParams) {
        console.log("Controller initialized (ListCtrl)");

        $scope.searchValue = "";

        function refresh() {
            $http
                .get("/api/v1/conferences")
                .then(function(response) {
                    $scope.conferences = response.data;
                });

            $scope.newConference = {
                idConference: "",
                conference: "",
                acronym: "",
                edition: "",
                city: "",
                country: "",
                keywords: ""
            };
        }

        $scope.searchConference = function() {
            $http({
                    url: "/api/v1/conferences",
                    params: { "search": $scope.searchValue }
                })
                .then(
                    function(response){
                        if(response.data.length == 0){
                            $scope.conferenceExists = false;
                            toastr.error("The data is not founded");
                        }else {
                            $scope.conferences = response.data;
                            console.log($scope.conferences);
                        }
                    }, function(response){
                        $scope.conferenceExists = false;
                    
                });
        };

        $scope.addConference = function() {

            $http
                .post("/api/v1/conferences/", $scope.newConference)
                .then(function(response) {
                    refresh();
                    toastr.info("The data is succesfully added!");
                }, function(error) {
                    switch (error.status) {
                        case 400:
                            toastr.error("Error adding data - incorrect data was entered!");
                            break;
                        case 409:
                            toastr.error("Error adding data - the data already exists!");
                            break;
                        case 422:
                            toastr.error("Error adding data - some field is wrong!");
                            break;
                        default:
                            toastr.error("Error adding data!");
                            break;
                    }
                });
        };

        $scope.deleteConference = function(idConference) {

            $http
                .delete("/api/v1/conferences/" + idConference)
                .then(function(response) {
                    refresh();
                    toastr.info("Data has been deleted succesfully!");
                }, function(error) {
                    toastr.error("Error deleting data!");
                });

        };

        $scope.deleteAllConferences = function() {

            $http
                .delete("/api/v1/conferences/")
                .then(function(response) {
                    console.log("All data deleted");
                    toastr.info("All data has been deleted succesfully!");
                    refresh();
                }, function(error) {
                    toastr.error("Error deleting all data!");
                });
        };

        refresh();

    }]);
