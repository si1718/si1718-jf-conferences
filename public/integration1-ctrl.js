/* global angular */
/* global Highcharts*/
angular.module("DataManagementApp")
    .controller("Integration1Ctrl", ["$scope", "$http", "$location", "$routeParams", function($scope, $http, $location, $routeParams) {
        console.log("Controller initialized (Integration1Ctrl)");

        $http.get("/api/v1/conferences").then(function(response) {

            $scope.data = {};
            var dataCache = {};
            
            $scope.idConference = [];
            $scope.conference = [];
            $scope.acronym = [];
            $scope.edition = [];
            $scope.city = [];
            $scope.country = [];
            $scope.title = [];
            $scope.year = [];
            $scope.editor = [];
            $scope.coeditors = [];
            $scope.isbn = [];
            $scope.city2 = [];
            $scope.country = [];
            
 $http.get("../conferences").then(function(response) {

            dataCacheEsl = response.data;
            $scope.data = dataCacheEsl;

            for (var i = 0; i < response.data.length; i++) {
                $scope.categorias.push($scope.data[i].country + " " + $scope.data[i].year);
                $scope.eslmale.push(Number($scope.data[i].eslmale));
                $scope.eslfemale.push(Number($scope.data[i].eslfemale));
                $scope.esltotal.push(Number($scope.data[i].esltotal));
                $scope.eslobjective.push(Number($scope.data[i].eslobjective));

                console.log($scope.data[i].country);
            }

            $http.get("/api/v1/gdp-per-capita" + "?" + "apikey=" + $scope.apikey).then(function(response) {
                dataCache = response.data;
                $scope.data = dataCache;

                for (var i = 0; i < response.data.length; i++) {
                    $scope.categorias1.push($scope.data[i].country + " " + $scope.data[i].year);
                    //$scope.country.push($scope.data[i].country);
                    //$scope.year.push(Number($scope.data[i].year));
                    $scope.gdp_per_capita_growth.push(Number($scope.data[i]["gdp-per-capita-growth"]));
                    $scope.gdp_per_capita.push(Number($scope.data[i]["gdp-per-capita"]));
                    $scope.gdp_per_capita_ppp.push(Number($scope.data[i]["gdp-per-capita-ppp"]));

                }
                console.log("Controller initialized (GdpPerCapitaProxyGraphCtrl)");

                // Gestión de datos
                var categoriasTotal = [];
                var gdpPerCapitaGrowthTotal = [];
                var eslMaleTotal = [];
                var eslFemalTotal = [];
                var eslTotalTotal = [];
                var eslObjectiveTotal = [];

                var repeated = new Array($scope.categorias1.length).fill(false);
               
                for (var i = 0; i < $scope.categorias.length; i++) {
                    var check = false;
                    var index = 0;
                    for (var j = 0; j < $scope.categorias1.length; j++) {
                        if ($scope.categorias[i] == $scope.categorias1[j]) {
                            repeated[j] = true;
                            check = true;
                            index = j;
                        }
                    }
                    if (check) {
                        gdpPerCapitaGrowthTotal.push($scope.gdp_per_capita_growth[index]);

                    }
                    else {
                        gdpPerCapitaGrowthTotal.push(0);
                    }
                    categoriasTotal.push($scope.categorias[i]);
                    eslMaleTotal.push($scope.eslmale[i]);
                    eslFemalTotal.push($scope.eslfemale[i]);
                    eslTotalTotal.push($scope.esltotal[i]);
                    eslObjectiveTotal.push($scope.eslobjective[i]);
                }
            
                for (var r = 0; r < repeated.length; r++) {
                    if (!repeated[r]) {
                        categoriasTotal.push($scope.categorias1[r]);
                        gdpPerCapitaGrowthTotal.push($scope.gdp_per_capita_growth[r]);
                        eslMaleTotal.push(0);
                        eslFemalTotal.push(0);
                        eslTotalTotal.push(0);
                        eslObjectiveTotal.push(0);
                    }
                }
        });

    }]);
