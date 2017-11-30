/* global angular */
/* global Highcharts*/
angular.module("DataManagementApp")
    .controller("AnalyticsCtrl", ["$scope", "$http", "$location", "$routeParams", function($scope, $http, $location, $routeParams) {
        console.log("Controller initialized (AnalyticsCtrl)");

        $scope.data = {};
        var dataCache = {};
        $scope.idConference = [];
        $scope.conference = [];
        $scope.acronym = [];
        $scope.edition = [];
        $scope.city = [];
        $scope.country = [];
        
        $scope.countryMap = {};
        $http.get("/api/v1/conferences").then(function(response) {

            dataCache = response.data;
            $scope.data = dataCache;
            
            for (var i = 0; i < response.data.length; i++) {
                /*$scope.idConference.push($scope.data[i].idConference);
                $scope.conference.push($scope.data[i].conference);
                $scope.acronym.push($scope.data[i].acronym);
                $scope.edition.push(Number($scope.data[i].edition));
                $scope.city.push($scope.data[i].city);*/
                if($scope.countryMap[$scope.data[i].country]){// ya tenemos este año??
                    $scope.countryMap[$scope.data[i].country] += 1; //entonces sumale uno
                }else{
                    $scope.countryMap[$scope.data[i].country] = 1;
                }
                
                console.log($scope.data[i].idConference, $scope.data[i].conference, $scope.data[i].city, $scope.data[i].country);
            }

        //});

        $http.get("/api/v1/conferences").then(function(response) {

            //Highchart

            Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Data representation'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: Object.keys($scope.countryMap),
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Value'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'Country',
                    data: Object.values($scope.countryMap)

                }]

            });

        });
        });

    }]);
