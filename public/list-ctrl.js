/* global angular */
/* global toastr */
/* global toastr */

angular.module("DataManagementApp")
    .controller("ListCtrl", ["$scope", "$http", "$location", "$routeParams", "$log", function($scope, $http, $location, $routeParams, $log) {
        console.log("Controller initialized (ListCtrl)");

        $scope.searchValue = "";


        /*$scope.conferenceExists = true;
        $scope.limit = 10;
        $scope.maxPagesLinksView = 5;

        $scope.page = 1;
        $scope.totalItems = 0;

        function extractCount() {
            var apiCountRequest = "/api/v1/resultsCount";
            if ($scope.searchValue != "") {
                apiCountRequest = apiCountRequest + "?" + "search=" + $scope.searchValue;
            }
            $http
                .get(apiCountRequest)
                .then(function(count) {
                    $scope.totalItems = count.data.res;
                }, function(error) {
                    $scope.errorMessage = "An unexpected error has ocurred.";
                    $scope.paginationError = true;
                });
            console.log($scope.totalItems);
        }*/

        function refresh() {
            //console.log("Refresh called");
            //console.log("Page number: " + $scope.page);
            var apiGetRequest = "/api/v1/conferences";
            //?limit=" + $scope.limit + "&skip=" + (($scope.page - 1) * $scope.limit);
           
            //console.log(apiGetRequest);
            $http
                .get(apiGetRequest)
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
           // extractCount();
            $http({
                    url: "/api/v1/conferences",
                    params: {
                        "search": $scope.searchValue,
                       /* "limit": $scope.limit,
                        "skip": (($scope.page - 1) * $scope.limit)*/
                    }
                })
                .then(
                    function(response) {
                        if (response.data.length == 0) {
                            $scope.conferenceExists = false;
                            toastr.error("The data is not founded");
                        }
                        else {
                            $scope.conferences = response.data;
                            //console.log($scope.conferences);
                        }
                    },
                    function(response) {
                        $scope.conferenceExists = false;

                    });
                    refresh();
        };
        
       /* $scope.searchConference2 = function() {
            extractCount();
            $scope.page = 1;
            $http({
                    url: "/api/v1/conferences",
                    params: {
                        "search": $scope.searchValue,
                        "limit": $scope.limit,
                        "skip": (($scope.page - 1) * $scope.limit)
                    }
                })
                .then(
                    function(response) {
                        if (response.data.length == 0) {
                            $scope.conferenceExists = false;
                            toastr.error("The data is not founded");
                        }
                        else {
                            $scope.conferences = response.data;
                            console.log($scope.conferences);
                        }
                    },
                    function(response) {
                        $scope.conferenceExists = false;

                    });
        };*/

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
        
        /* $scope.conferenceIdConference = $routeParams.idConference;


        $http
            .get("/api/v1/conferences/" + $scope.conferenceIdConference)
            .then(function(response) {
                $scope.viewedconferences = response.data;
            });*/

      /*  $scope.viewConference = function() {

            $http
                .get("/api/v1/conferences/" + $scope.idConference, $scope.viewedConferences)
                .then(function(response) {
                    console.log("viewed");
                    $location.path("/conferences");
                    toastr.info("The data is succesfully viewed!");
                }, function(error) {
                    toastr.error("Error viewing data!");

                });
        };*/

      /*  $scope.pageChanged = function() {
            $scope.searchConference();
        };*/

       // extractCount();
        refresh();

    }]);
