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
            $scope.dis = false;
        };
        
        $scope.dis = false;
        
        function urlIdProceeding(data){
            return "https://si1718-ajr-proceedings.herokuapp.com/api/v1/proceedings" + "/" + data.idProceeding;
        }
        
        $scope.validate = function() {
            var url = "https://si1718-ajr-proceedings.herokuapp.com/api/v1/proceedings" + "?" + "year=" + 
                           /* $scope.proceedingField + "&city=" + $scope.proceedingField + "&country=" + $scope.proceedingField + 
                            "&editor=" + $scope.proceedingField + "&idProceeding=" + $scope.proceedingField + "&isbn=" + $scope.proceedingField + 
                            "&title=" + $scope.proceedingField + "&coeditors=" +*/ $scope.proceedingField;
                            console.log(url);
                            
            $http
                .get(url)
                .then(function (response){
                    console.log(response);
                    if(response.data.length == 0){
                        console.log("Sin coincidencias");
                        toastr.info("Sin coincidencias");
                    } else {
                        $scope.proceedingField = response.data[0].title;
                        $scope.updatedConference.proceeding = urlIdProceeding(response.data[0]);
                        $scope.updatedConference.proceedingTitle = response.data[0].title;
                        $scope.updatedConference.proceedingViewURL = response.data[0].viewURL;
                        $scope.dis = true;
                    }
                }, function(error){
                        console.log("Error server o no hay coincidencias");
                        toastr.error("Error server o no hay coincidencias");
                });
        }
    }]);
