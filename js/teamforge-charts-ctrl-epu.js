/*---------------------------------------------------------------------------------------------------------------------
 The CFD Controller for cumulative flow diagrams
 ---------------------------------------------------------------------------------------------------------------------*/

app.controller('epuCtrl', function ($scope, $http, parameter) {

    $scope.error_message = '';

    // Set chart options
    $scope.options = {
        tooltips: {
            mode: "single"
        },
        hover: {
            mode: "single"
        },
        scales: {
            xAxes: [
                {
                    stacked: true
                }
            ],
            yAxes: [
                {
                    stacked: true,
                }
            ]
        }
    };

    // Set chart colors
    var colors = [
        'rgba(31,119,180,1)',
        'rgba(174,199,232,1)',
        'rgba(255,127,14,1)',
        'rgba(255,187,120,1)',
        'rgba(152,223,138,1)',
        'rgba(148,103,189,1)',
        'rgba(197,176,213,1)'
    ];
    Chart.defaults.global.colors = colors.map(function (color) {
        return {
            borderColor: color,
            backgroundColor: color,
            pointBorderColor: color,
            pointBackgroundColor: color,
        }
    });


    // Define a function which sets an Url Error
    var setUrlError = function (response) {
        $scope.error_message = "Got HTTP " + response.status + " error while retrieving data: " + response.data.message;
    };

    // Init function - to be loaded when graph is being generated
    $scope.init = function (config) {
        // Set loading flags
        $scope.loading_canvas = true;

        // Set config
        if (typeof config == "undefined") config = angular.copy(epu_config_default);

        // Overwrite config with get parameters
        config.date_from = parameter.get('date_from', config.date_from);
        config.date_until = parameter.get('date_until', config.date_until);
        config.plain_view = parameter.get('plain_view', config.plain_view);
        config.trackers = parameter.get('trackers', config.trackers);
        config.planned_date_fields = parameter.get('planned_date_fields', config.planned_date_fields);

        // set trackers
        $scope.trackers = config.trackers;
        $scope.trackers_array = config.trackers.split(",");

        // set planned_date_fields
        $scope.planned_date_fields = config.planned_date_fields;
        $scope.planned_date_fields_array = config.planned_date_fields.split(",");

        // set plain view
        $scope.plain_view = config.plain_view == "true" || config.plain_view == 1;

        // Set dates
        $scope.date = {};
        $scope.date.from = new Date(config.date_from + "T12:00:00");
        $scope.date.until = new Date(config.date_until + "T12:00:00");

        // Check if date.from <= date.until
        if ($scope.date.from > $scope.date.until) {
            $scope.error_message = 'Invalid date range: date.from is greater than date.until';
        }

        $scope.getDataAndDraw();
    }

    $scope.getDataAndDraw = function () {
        // Set spinner
        $scope.loading_canvas = true;

        // Set array of errors_per_user and then to fetch the errors per user (not very elegantly yet)
        var efforts_per_user = [];

        // Set function to get last timestamp and then to
        var fetch_efforts_per_user = function (tracker, planned_date_field) {
            $http.get(restheart_config.base_url + tracker + "/_aggrs/latest_import_timestamp").then(
                function (response) {
                    var import_timestamp = response.data._embedded["rh:result"][0].importTimestamp;

                    $http.get(restheart_config.base_url + tracker + "/_aggrs/current_effort_per_user?pagesize=1000&avars={'import_timestamp':'" + import_timestamp + "','planned_date_field':'$" + planned_date_field + "','datetime_from':'" + $scope.date.from.toISOString().substr(0, 10) + "T00:00:00','datetime_until':'" + $scope.date.until.toISOString().substr(0, 10) + "T23:59:59'}").then(
                        function (response) {
                            efforts_per_user.push(response.data._embedded["rh:result"]);
                            $scope.drawGraph(efforts_per_user);
                        },
                        setUrlError);
                },
                setUrlError);
        };

        // Check some consistencies
        if ($scope.trackers_array.length != $scope.planned_date_fields_array.length) {
            $scope.error_message = "Length of trackers parameter has to be equal the length planned_date_fields parameters";
            return;
        }

        for (var i in $scope.trackers_array) {
            fetch_efforts_per_user($scope.trackers_array[i], $scope.planned_date_fields_array[i]);
        }
    }

    $scope.drawGraph = function (efforts_per_user) {
        // Exit if not all efforts per user have been defined
        if (efforts_per_user.length < $scope.trackers_array.length) {
            return;
        }

        // Aggregate all tracker data
        var aggregated_estimated_efforts_per_user = {};
        var aggregated_actual_efforts_per_user = {};
        var aggregated_remaining_efforts_per_user = {};

        for (var i in efforts_per_user) {
            for (var j in efforts_per_user[i]) {
                var user = efforts_per_user[i][j].assignedTo;
                if (typeof aggregated_estimated_efforts_per_user[user] == "undefined") aggregated_estimated_efforts_per_user[user] = 0;
                aggregated_estimated_efforts_per_user[user] = aggregated_estimated_efforts_per_user[user] + efforts_per_user[i][j].estimatedEffort;

                if (typeof aggregated_actual_efforts_per_user[user] == "undefined") aggregated_actual_efforts_per_user[user] = 0;
                aggregated_actual_efforts_per_user[user] = aggregated_actual_efforts_per_user[user] + efforts_per_user[i][j].actualEffort;

                if (typeof aggregated_remaining_efforts_per_user[user] == "undefined") aggregated_remaining_efforts_per_user[user] = 0;
                aggregated_remaining_efforts_per_user[user] = aggregated_remaining_efforts_per_user[user] + efforts_per_user[i][j].remainingEffort;
            }
        }


        // Reset all data
        $scope.labels = [];
        $scope.series = [];
        $scope.data = [];
        $scope.datasetOverride = [];

        $scope.labels = Object.keys(aggregated_estimated_efforts_per_user).sort();


        var flatten_array = function (array, labels) {
            var flat_array = []
            for (var i in labels) {
                flat_array.push(array[labels[i]]);
            }
            return flat_array
        }
        $scope.series.push("Actual Effort");
        $scope.data.push(flatten_array(aggregated_actual_efforts_per_user, $scope.labels));

        $scope.series.push("Remaining Effort");
        $scope.data.push(flatten_array(aggregated_remaining_efforts_per_user, $scope.labels));

        // Disable spinner
        $scope.loading_canvas = false;
    }

    $scope.$on('chart-create', function (event, chart) {
        if ($scope.plain_view)
            document.getElementById('js-legend-plain').innerHTML = chart.generateLegend();
        else
            document.getElementById('js-legend').innerHTML = chart.generateLegend();
    });

});
