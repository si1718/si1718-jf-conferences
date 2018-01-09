/* global angular */
/* global Highcharts*/
angular.module("DataManagementApp")
    .controller("Integration1Ctrl", ["$scope", "$http", "$location", "$routeParams", function($scope, $http, $location, $routeParams) {
        console.log("Controller initialized (Integration1Ctrl)");


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

        $scope.conferenceMap = {};

        $http.get("/api/v1/conferences")
            .then(function(response) {
                dataCache = response.data;
                $scope.data = dataCache;

                var countryApi = {};
                var data2 = {};
                var nProceedings = 0;
                var confName = {};
                var confAcronym = {};


                $http.get("https://si1718-ajr-proceedings.herokuapp.com/api/v1/proceedings")
                    .then(function(response) {
                        data2 = response.data;
                        //console.log(data2.length)
                        var listSearchedConferences = [];
                        for (var i = 0; i < $scope.data.length; i++) {
                            countryApi = $scope.data[i].country;
                            confName = $scope.data[i].conference;

                            if (listSearchedConferences.indexOf(confName) != -1) {
                                continue;
                            }

                            confAcronym = $scope.data[i].acronym;
                           // console.log(confName + "     iteracion " + i);
                            var title = "";
                            for (var j = 0; j < data2.length; j++) {
                                title = data2[j].title;
                               // console.log(title + "     iteracion " + j);
                                if (title.includes(confName) || confName.includes(title)) {
                                    console.log("entra")

                                    if (!$scope.conferenceMap[confName]) {
                                        $scope.conferenceMap[confName] = 1;
                                    }
                                    else {
                                        $scope.conferenceMap[confName] += 1;
                                    }
                                }
                                else {
                                   // console.log(title.length + " " + confName.length);
                                }
                            }
                            listSearchedConferences.push(confName);
                        }
                        console.log(listSearchedConferences);
                        console.log($scope.conferenceMap);

                        // Highcharts

                        Highcharts.chart('container', {
                            chart: {
                                type: 'bar'
                            },
                            title: {
                                text: 'Data representation'
                            },
                            subtitle: {
                                text: ''
                            },
                            xAxis: {
                                categories: Object.keys($scope.conferenceMap),
                                title: {
                                    text: null
                                }
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Nº de proceedings',
                                    align: 'high'
                                },
                                labels: {
                                    overflow: 'justify'
                                }
                            },
                            tooltip: {
                                valueSuffix: ''
                            },
                            plotOptions: {
                                bar: {
                                    dataLabels: {
                                        enabled: true
                                    }
                                }
                            },
                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'top',
                                x: -40,
                                y: 50,
                                floating: true,
                                borderWidth: 1,
                                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                                shadow: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: [{
                                name: 'Conference',
                                data: Object.values($scope.conferenceMap)
                            }]
                        });

                    });


            });
    }]);
