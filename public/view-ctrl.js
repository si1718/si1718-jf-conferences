angular.module("DataManagementApp")
    .controller("ViewCtrl", ["$scope", "$http", "$location", "$routeParams", "$log", function($scope, $http, $location, $routeParams, $log) {
        console.log("Controller initialized (ViewCtrl)");

        $scope.conferenceIdConference = $routeParams.idConference;

       /* function refresh(idConference) {
            $http.get("/api/v1/conferences/" + $scope.conferenceIdConference).then(function(response) {
                $scope.viewedConferences = response.data[0];
                $http.get("/api/v1/recommendations/" + $scope.conferenceIdConference, $scope.viewedConferences).then(function(response) {
                    $scope.recommendations = response.data[1];
                }, function(error) {
                    console.log("error, no recommendations");
                });
            });
        }

        function cancel() {
            $location.path("/conferences");
        }

        refresh($scope.conferenceIdConference);*/

        $http
             .get("/api/v1/conferences/" + $scope.conferenceIdConference)
             .then(function(response) {
                 $scope.viewedConferences = response.data;
             });

         $scope.viewConference = function() {

             $http
                 .get("/api/v1/conferences/" + $scope.conferenceIdConference, $scope.viewedConferences)
                 .then(function(response) {
                     console.log("viewed");
                     $location.path("/conferences");
                     toastr.info("The data is succesfully viewed!");

                     $http
                         .get("/api/v1/recommendations/" + $scope.conferenceIdConference)
                         .then(function(response) {
                             $scope.recommendationsConferences = response.data;
                             var recomendaciones = [];
                             for (var i in $scope.recommendationsConferences) {
                                 console.log("entra");
                                 var recomendacion1 = $scope.recommendationsConferences[i].recommendations[0];
                                 var recomendacion2 = $scope.recommendationsConferences[i].recommendations[1];
                                 var recomendacion3 = $scope.recommendationsConferences[i].recommendations[2];

                                 if ($scope.conferenceIdConference == $scope.recommendations[i].idConference) {
                                     recomendaciones.push(recomendacion1 + ',' + recomendacion2 + ',' + recomendacion3);
                                 }
                             }
                         })
                 }, function(error) {
                     toastr.error("Error viewing data!");

                 });
         };



        /* $scope.recommendationConference = function() {
             var recomendaciones = [];

             $http
                 .get("/api/v1/recommendations" + $scope.idConference)
                 .then(function(response) {
                     $scope.recommendations = response.data;

                     for (var i in $scope.recommendations) {
                         console.log("entra");
                         var recomendacion1 = $scope.recommendations[i].recommendations[0];
                         var recomendacion2 = $scope.recommendations[i].recommendations[1];
                         var recomendacion3 = $scope.recommendations[i].recommendations[2];

                         if ($scope.conferenceIdConference == $scope.recommendations[i].idConference) {
                             recomendaciones.push(recomendacion1 + ',' + recomendacion2 + ',' + recomendacion3);
                         }
                     }
                 })
         };*/


    }]);
