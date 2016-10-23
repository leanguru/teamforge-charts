/*---------------------------------------------------------------------------------------------------------------------
 The CFD Controller for cumulative flow diagrams
 ---------------------------------------------------------------------------------------------------------------------*/

app.controller('epuCtrl', function ($scope, $http, data_conversion, parameter, planning_folders, workflow) {

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
            yAxes: [
                {
                    id: 'y-axis-1',
                    display: true,
                    position: 'left',
                    stacked: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'User'
                    }
                }
            ]
        }
    };

    // Define a function which sets an Url Error
    var setUrlError = function (response) {
        $scope.error_message = "Got HTTP " + response.status + " error while retrieving data: " + response.data.message;
    };

    // Init function - to be loaded when graph is being generated
    $scope.init = function () {
        // Set loading flags
        $scope.loading_planning_folders = true;
        $scope.loading_canvas = true;

        // Set dates
        $scope.date_from = new Date(config.date_from + "T12:00:00");
        $scope.date_until = new Date(config.date_until + "T12:00:00");

        // Check if date_from <= date_until
        if ($scope.date_from > $scope.date_until) {
            $scope.error_message = 'Invalid date range: date_from is greater than date_until';
        }
        $scope.getDataAndDraw(cpe_config_default)
    }

    $scope.getDataAndDraw = function (config) {
        // Set spinner
        $scope.loading_canvas = true;

        // Set array of errors_per_user and then to fetch the errors per user (not very elegantly yet)
        var efforts_per_user = [];

        // Set function to get last timestamp and then to
        var fetch_efforts_per_user = function (tracker, date_field) {
            return $http.get(restheart_config.base_url + tracker + "/_aggrs/last_import_timestamp").then(
                function (response) {
                    var import_timestamp = response.data._embedded["rh:result"][0].import_timestamp;

                    $http.get(restheart_config.base_url + tracker + "/_aggrs/current_effort_per_user?pagesize=1000&avars={'import_timestamp':'"+import_timestamp+"','planned_date_field': '$" + date_field + "','datetime_from':'" + $scope.date_from.toISOString().substr(0, 10) + "T00:00:00','datetime_until':'" + $scope.date_until.toISOString().substr(0, 10) + "T23:59:59'}").then(
                        function (response) {
                            efforts_per_user.push(response.data._embedded["rh:result"]);
                            $scope.drawGraph(config, efforts_per_user);
                        },
                        setUrlError);
                },
                setUrlError);
        };

        for (var i in config.trackers) {
            fetch_efforts_per_user(config.trackers[i].id,config.trackers[i].date_field)
        }
    }

    $scope.drawGraph = function (config, efforts_per_user) {

        // Exit if not all efforts per user have been defined
        if (efforts_per_user.length < config.trackers.length) {
            return;
        }

        // Aggregate all tracker data
        var aggregated_effort_per_user = {};
        for (var i in efforts_per_user) {
            var user = efforts_per_user[i].assignedTo;
            if ( typeof aggregated_estimated_effort_per_user[user] == "undefined" ) aggregated_estimated_effort_per_user[user] = 0;
            aggregated_estimated_effort_per_user[user] = aggregated_estimated_effort_per_user[user] + efforts_per_user[i].estimatedEffort;

            if ( typeof aggregated_actual_effort_per_user[user] == "undefined" ) aggregated_actual_effort_per_user[user] = 0;
            aggregated_actual_effort_per_user[user] = efforts_per_user[i].actualEffort;

            if ( typeof aggregated_remaining_effort_per_user[user] == "undefined" ) aggregated_remaining_effort_per_user[user] = 0;
            aggregated_remaining_effort_per_user[user] = efforts_per_user[i].remainingEffort;
        }


        // Reset all data
        $scope.labels = [];
        $scope.series = [];
        $scope.data = [];
        $scope.datasetOverride = [];

        $scope.labels = Object.keys(aggregated_estimated_effort_per_user).sort();


        var flatten_array = function (array,labels) {
            var flat_array = []
            for (var i in labels) {
                flat_array.push(array[labels[i]]);
            }
            return flat_array
        }
        $scope.series.push("Actual Effort");
        $scope.data.push(flatten_array(aggregated_actual_effort_per_user,$scope.labels));
        $scope.datasetOverride.push({
                type: 'bar',
                backgroundColor: 'blue'
        });

        $scope.series.push("Remaining Effort");
        $scope.datasets.push(flatten_array(aggregated_actual_effort_per_user,$scope.labels));
        $scope.datasetOverride.push({
                type: 'bar',
                backgroundColor: 'red'
        });

        // Disable spinner
        $scope.loading_canvas = false;
    }


});
