angular.module("DataManagementApp")
    .controller("StreamingCtrl", ["$scope", "$http", "$location", "$routeParams", function($scope, $http, $location, $routeParams) {
        console.log("Controller initialized (StreamingCtrl)");

        $http
            .get("/api/v1/batch")
            .then(function(response) {
                $scope.batch = response.data;
                var tweetsStats = [];
                var arrayTweetsKeywordDate = [];
                for (var i in $scope.batch) {
                    console.log("entra")

                    tweetsStats.push($scope.batch[i].numTweets);

                    var tweetsKeyword = $scope.batch[i].keyword;
                    var tweetsDate = $scope.batch[i].date;

                    arrayTweetsKeywordDate.push(tweetsKeyword + '-' + tweetsDate);

                }
                Highcharts.chart('container', {
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: 'Tweets statistics by date'
                    },
                    xAxis: {
                        categories: arrayTweetsKeywordDate,

                        title: {
                            text: 'Keywords+Date'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Statistics tweets'
                        },
                        labels: {
                            formatter: function() {
                                return this.value;
                            }
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>' + this.series.name + '</b><br/>' +
                                this.x + ': ' + this.y;
                        }
                    },

                    plotOptions: {
                        spline: {
                            marker: {
                                enabled: true
                            }
                        }
                    },

                    series: [{
                        name: 'Statistic Tweets',
                        data: tweetsStats
                    }]
                });

            });

    }]);
