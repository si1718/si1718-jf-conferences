/* global angular */
/* global toastr */

angular.module("DataManagementApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) {
        $scope.conferenceIdConference = $routeParams.idConference;
        console.log("Controller initialized (EditCtrl)");

        $http
            .get("/api/v1/conferences/" + $scope.conferenceIdConference)
            .then(function(response) {
                $scope.updatedConference = response.data;
            });

        $scope.updateConference = function() {

            delete $scope.updatedConference._id;

            $http
                .put("/api/v1/conferences/" + $scope.conferenceIdConference, $scope.updatedConference)
                .then(function(response) {
                    console.log("updated");
                    $location.path("/conferences");
                    toastr.info("The data is succesfully edited!");
                }, function(error) {
                    switch (error.status) {
                        case 422:
                            toastr.error("Error editing data - some field is wrong");
                            break;
                        default:
                            toastr.error("Error editing data!");
                            break;
                    }
                });
        };
    }]);
