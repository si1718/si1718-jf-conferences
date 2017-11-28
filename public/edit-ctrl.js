/* global angular */
/* global Materialize */

angular.module("DataManagementApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) {
        //$scope.conferenceIdConference = $routeParams.idConference;
        console.log("Controller initialized (EditCtrl)" /*+ $scope.conferenceIdConference*/ );

        function refresh() {
            $http
                .get("/api/v1/conferences/" + $routeParams.idConference)
                .then(function(response) {
                    $scope.updatedConference = response.data;
                });
        }
        
        
        function backToListConferences(){
            $location.path("/conferences");
        }
        
        // $scope.discardData = function() {
        //     console.log("Discarding changes and returning back to main view");
        //     backToListConferences();
        // };

        $scope.updateConference = function(data) {

            delete data._id;

            $http
                .put("/api/v1/conferences/" + data.idConference, data)
                .then(function(response) {
                    console.log(data.idConference + " edited!");
                    Materialize.toast('<i class="material-icons">done</i> ' + data.idConference + ' has been edited succesfully!', 4000);
                }, function(error){
                    switch (error.status){
                        case 422:
                            Materialize.toast('<i class="material-icons">error_outline</i> Error editing data - some field is wrong!', 4000);
                            break;
                        default:
                            Materialize.toast('<i class="material-icons">error_outline</i> Error editing data!', 4000);
                            break;
                    }
                });
                backToListConferences();
        };
        

        
        refresh();

    }]);
