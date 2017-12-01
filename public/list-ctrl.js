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
                country: ""
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
                    
                //     function(response) {
                //     console.log($scope.searchValue);
                //     $scope.conferences = response.data;
                // }, function(error) {
                //     switch (error.status) {
                //         case 404:
                //             toastr.error("The data is not founded");
                //             break;
                //         default:
                //             toastr.error("Error searching data!");
                //             break;
                //     }
                //     //$location.path("/conferences");
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

        // $scope.conferences = [];

        // $scope.dataList = function() {
        //     return $scope.conferences;
        // };

        // function refresh() {
        //     $http({
        //         url: "/api/v1/conferences",
        //         params: $routeParams
        //     }).then(function(response) {
        //         $scope.conferences = response.data;
        //         //     if( !$.isArray(response.data) ||  !response.data.length ) {
        //         //         swal("There are no researchers that match your search", null, "info");
        //         //     }
        //         // }, function(error){
        //         //     swal("There are no researchers that match your search", null, "info");

        //     });


        //     $scope.newConference = {
        //         conference: "",
        //         acronym: "",
        //         edition: "",
        //         city: "",
        //         country: ""
        //     };

        //     $scope.updateConference = {
        //         idConference: "",
        //         conference: "",
        //         acronym: "",
        //         edition: "",
        //         city: "",
        //         country: ""
        //     };
        // }

        // $scope.addConference = function() {

        //     $http
        //         .post("/api/v1/conferences/", $scope.newConference)
        //         .then(function(response) {
        //             refresh();
        //             console.log("Data added");
        //             toastr.info("The data is succesfully added!");
        //         }, function(error) {
        //             switch (error.status) {
        //                 case 400:
        //                     toastr.error("Error adding data - incorrect data was entered!");
        //                     break;
        //                 case 409:
        //                     toastr.error("Error adding data - the data already exists!");
        //                     break;
        //                 case 422:
        //                     toastr.error("Error adding data - some field is wrong!");
        //                     break;
        //                 default:
        //                     toastr.error("Error adding data!");
        //                     break;
        //             }
        //         });

        // };

        // $scope.editConference = function(idConference) {

        //     delete $scope.updateConference._id;

        //     $http
        //         .put("/api/v1/conferences/" + idConference, $scope.updateConference)
        //         .then(function(response) {
        //             refresh();
        //             $scope.openEditModal(idConference);
        //             console.log("edited!");
        //             toastr.info("The data is succesfully edited!");
        //             $location.path("/conferences");
        //         }, function(error) {
        //             switch (error.status) {
        //                 case 422:
        //                     toastr.error("Error editing data - some field is wrong");
        //                     break;
        //                 default:
        //                     toastr.error("Error editing data!");
        //                     break;
        //             }
        //         });
        // };

        // // $scope.searchConference = function() {
        // //     console.log("Data founded");
        // //     $http({
        // //             url: "/api/v1/conferences",
        // //             params: $scope.tosearch
        // //         })
        // //         .then(function(response) {
        // //             $scope.conferences = response.data;
        // //         }, function(error) {
        // //             toastr.error("The data is not found");
        // //         });
        // // };



        // $scope.deleteConference = function(idConference) {

        //     $http
        //         .delete("/api/v1/conferences/" + idConference)
        //         .then(function(response) {
        //             refresh();
        //             console.log("Data deleted");
        //             toastr.info("The data is succesfullty deleted");
        //             refresh();
        //         }, function(error) {
        //             toastr.error("Error deleting data");
        //         });

        // };

        // $scope.deleteAllConferences = function() {

        //     $http
        //         .delete("/api/v1/conferences/")
        //         .then(function(response) {
        //             console.log("All data deleted");
        //             toastr.info("All data has been deleted succesfully!");
        //             refresh();
        //         }, function(error) {
        //             toastr.error("Error deleting all data!");
        //         });
        // };

    }]);
