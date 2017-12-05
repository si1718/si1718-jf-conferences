/* global angular */
/* global Highcharts*/
angular.module("DataManagementApp")
    .controller("Integration2Ctrl", ["$scope", "$http", "$location", "$routeParams", function($scope, $http, $location, $routeParams) {
        console.log("Controller initialized (Integration2Ctrl)");


        $scope.data = {};
        var dataCache = {};

        $scope.idConference = [];
        $scope.conference = [];
        $scope.acronym = [];
        $scope.edition = [];
        $scope.city = [];
        $scope.country = [];

        $scope.idPaper = [];
        $scope.authors = [];
        $scope.conference1 = [];
        $scope.type = [];
        $scope.city1 = [];
        $scope.country1 = [];
        $scope.year = [];
        $scope.proceeding = [];

        $scope.conferenceMap = {};



        $http.get("/api/v1/conferences")
            .then(function(response) { 
                dataCache = response.data;
                $scope.data = dataCache;

                var countryApi = {};
                var data2 = {};
                var nPapers = 0;
                var confName = {};
                var confAcronym = {};


                $http.get("https://si1718-nlg-papers.herokuapp.com/api/v1/papers")
                    .then(function(response) {
                        data2 = response.data;
                        console.log(data2.length)
                        var listSearchedConferences = [];
                        for (var i = 0; i < $scope.data.length; i++) {
                            countryApi = $scope.data[i].country;
                            confName = $scope.data[i].conference;
                            
                            if(listSearchedConferences.indexOf(confName)!=-1){
                                continue;
                            }
                            
                            confAcronym = $scope.data[i].acronym;
                            console.log(confName + "     iteracion " + i);
                            var proceeding = "";
                            for (var j = 0; j < data2.length; j++) {
                                proceeding = data2[j].proceeding;
                                console.log(proceeding  + "     iteracion " + j);
                                if (proceeding.includes(confName) || confName.includes(proceeding)) {
                                    console.log("entra")
                                    if (!$scope.conferenceMap[confName]) {
                                        $scope.conferenceMap[confName] = 1;
                                    }
                                    else {
                                        $scope.conferenceMap[confName] += 1;
                                    }
                                }else{
                                    console.log(proceeding.length + " " + confName.length);
                                }
                            }
                            listSearchedConferences.push(confName);
                        }
                        console.log(listSearchedConferences);
                        console.log($scope.conferenceMap);
                        
                        // Highcharts

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
                                categories: Object.keys($scope.conferenceMap),
                                crosshair: true
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Nº de papers'
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
                                name: 'Conference',
                                data: Object.values($scope.conferenceMap)

                            }]

                        });

                    });


            });




        // $scope.typeMap = {};
        // $scope.conferenceMap = {};

        // $http.get("https://si1718-nlg-papers.herokuapp.com/api/v1/papers").then(function(response) {

        //     dataCacheP = response.data;
        //     $scope.data = dataCacheP;

        //     for (var i = 0; i < response.data.length; i++) {
        //         if ($scope.typeMap[$scope.data[i].type]) {
        //             $scope.typeMap[$scope.data[i].type] += 1;
        //         }
        //         else {
        //             $scope.typeMap[$scope.data[i].type] = 1;
        //         }
        //     }

        //     $http.get("/api/v1/conferences").then(function(response) {
        //         dataCache = response.data;
        //         $scope.data = dataCache;

        //         for (var i = 0; i < response.data.length; i++) {
        //             $scope.country.push($scope.data[i].country);
        //             if ($scope.conferenceMap[$scope.data[i].conference]) { 
        //                 $scope.conferenceMap[$scope.data[i].conference] += 1; 
        //             }
        //             else {
        //                 $scope.conferenceMap[$scope.data[i].conference] = 1;
        //             }

        //         }


        //         //Highchart 

        //         Highcharts.chart('container', {
        //             title: {
        //                 text: 'Conferences data integrated with data of papers'
        //             },
        //             xAxis: {
        //                 categories: $scope.country
        //             },
        //             series: [{
        //                 type: 'column',
        //                 name: 'Conference',
        //                 data: Object.values($scope.conferenceMap)
        //             }, {
        //                 type: 'spline',
        //                 name: 'Type',
        //                 data: Object.values($scope.typeMap),
        //                 marker: {
        //                     lineWidth: 2,
        //                     lineColor: Highcharts.getOptions().colors[3],
        //                     fillColor: 'white'
        //                 }
        //             }]
        //         });


        //     });

        // });

    }]);
