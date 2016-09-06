/*---------------------------------------------------------------------------------------------------------------------
 The CFD Controller for cumulative flow diagrams
 ---------------------------------------------------------------------------------------------------------------------*/

app.controller('cfdCtrl', function ($scope, $http, data_conversion, parameter, planning_folders, workflow) {

    $scope.planning_folders = [];
    $scope.error_message = '';

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

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
                    type: 'linear',
                    display: true,
                    position: 'left',
                    scaleLabel: {
                        display: true,
                        labelString: 'Qty. of Artifacts'
                    }
                }
            ]
        }
    };

    // Set chart colors
    var colors = [
        'rgba(214,39,40,1)',
        'rgba(44,160,44,1)',
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
    $scope.init = function () {
        // Set loading flags
        $scope.loading_planning_folders = true;
        $scope.loading_canvas = true;

        // Set dates
        var df = (new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10);
        $scope.date_from = new Date(parameter.get('date_from', df) + "T12:00:00");

        var du = (new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10);
        $scope.date_until = new Date(parameter.get('date_until', du) + "T12:00:00");

        // Check if date_from <= date_until
        if ($scope.date_from > $scope.date_until) {
            $scope.error_message = 'Invalid date range: date_from is greater than date_until';
        }

        // Set planned date field
        $scope.planned_date_field = parameter.get('planned_date_field', 'plannedDate')

        // Set value types
        if (parameter.get('aggregation_field', ''))
            $scope.aggregation_field = "'$" + parameter.get('aggregation_field', '') + "'";
        else
            $scope.aggregation_field = 1;

        // Set tracker
        $scope.tracker = parameter.get('tracker')
        if (!$scope.tracker || $scope.tracker.substr(0, 7) != 'tracker') {
            $scope.error_message = "You must inform a tracker: '" + $scope.tracker + "' is not a valid tracker."
        }

        // Load and set Planning folders
        planning_folders.setTracker($scope.tracker);
        planning_folders.setPlanningFolderDepth(parameter.get('planning_folder_depth', 3));
        var planning_folder_get_param = parameter.get('planning_folder', null);

        var setPlanningFolders = function () {
            $scope.planning_folders = planning_folders.getList();

            if (planning_folder_get_param) {
                $scope.planning_folder = planning_folders.getItem(planning_folder_get_param);
            } else {
                $scope.planning_folder = $scope.planning_folders[0];
            }

            $scope.loading_planning_folders = false;

            $scope.getDataAndDraw();
        }


        $scope.loading_planning_folders = true;
        planning_folders.fetch().then(setPlanningFolders);
    }

    $scope.statusFilter = function (item) {
        if (item.status === 'Not Started') return !$scope.planning_folder_not_started;
        if (item.status === 'In progress') return !$scope.planning_folder_in_progress;
        if (item.status === 'Inactive') return !$scope.planning_folder_inactive;
        return true;
    };

    $scope.getDataAndDraw = function () {
        // Set spinner
        $scope.loading_canvas = true;

        // Set data
        var status_quantities = null;
        var target_quantities = null;
        var planned_quantities = null;

        // Get data
        workflow.setTracker($scope.tracker);
        workflow.fetch().then(function () { drawGraph(status_quantities, target_quantities, planned_quantities) }, setUrlError);

        $http.get(restheart_config.base_url + $scope.tracker + "/_aggrs/status_quantities?pagesize=1000&avars={'aggregation_field': " + $scope.aggregation_field + ",'planned_date_field': '$" + $scope.planned_date_field + "','planning_folder':'" + $scope.planning_folder.id + "','datetime_from':'" + $scope.date_from.toISOString().substr(0, 10) + "T00:00:00','datetime_until':'" + $scope.date_until.toISOString().substr(0, 10) + "T23:59:59'}").then(
            function (response) {
                status_quantities = response.data._embedded["rh:result"];
                drawGraph(status_quantities, target_quantities, planned_quantities);
            },
            setUrlError);

        $http.get(restheart_config.base_url + $scope.tracker + "/_aggrs/target_quantities?pagesize=1000&avars={'aggregation_field': " + $scope.aggregation_field + ",'planned_date_field': '$" + $scope.planned_date_field + "','planning_folder':'" + $scope.planning_folder.id + "','datetime_from':'" + $scope.date_from.toISOString().substr(0, 10) + "T00:00:00','datetime_until':'" + $scope.date_until.toISOString().substr(0, 10) + "T23:59:59'}").then(
            function (response) {
                target_quantities = response.data._embedded["rh:result"];
                drawGraph(status_quantities, target_quantities, planned_quantities);
            },
            setUrlError);

        $http.get(restheart_config.base_url + $scope.tracker + "/_aggrs/planned_quantities?pagesize=1000&avars={'aggregation_field': " + $scope.aggregation_field + ",'planned_date_field': '$" + $scope.planned_date_field + "','planning_folder':'" + $scope.planning_folder.id + "','datetime_from':'" + $scope.date_from.toISOString().substr(0, 10) + "T00:00:00','datetime_until':'" + $scope.date_until.toISOString().substr(0, 10) + "T23:59:59'}").then(
            function (response) {
                planned_quantities = response.data._embedded["rh:result"];
                drawGraph(status_quantities, target_quantities, planned_quantities);
            },
            setUrlError);
    }

    var drawGraph = function (status_quantities, target_quantities, planned_quantities) {

        // Exit if workflow or status quanties aren't defined
        if (!workflow.get() || !status_quantities || !target_quantities || !planned_quantities) {
            return;
        }

        // Reset all data
        $scope.labels = [];
        $scope.series = [];
        $scope.data = [];
        $scope.datasetOverride = [];

        // Set x-axis labels
        var date_from = new Date($scope.date_from);
        var date_to = new Date($scope.date_until);
        var labels = [];
        var now_label = new Date().toISOString().substring(0, 10);
        for (var d = date_from; d <= date_to; d.setDate(d.getDate() + 1)) labels.push(d.toISOString().substring(0, 10));
        $scope.labels = labels;

        // Create accumulated Planned Quantities (assuming that array is already ordered0
        for (var i = 1; i < planned_quantities.length; i++)
            planned_quantities[i].qty = planned_quantities[i - 1].qty + planned_quantities[i].qty

        // Set planned Quantities
        var target_and_planned_quantities = {};

        var target_quantities = data_conversion.mongoDBArray2LabelDict(labels, target_quantities)
        var planned_quantities = data_conversion.mongoDBArray2LabelDict(labels, planned_quantities)
        for (var i = 0; i < labels.length; i++) {
            if (labels[i] <= now_label)
                target_and_planned_quantities[labels[i]] = target_quantities[labels[i]]
            else
                target_and_planned_quantities[labels[i]] = planned_quantities[labels[i]]
        }

        $scope.series.push("Planned");
        $scope.data.push(data_conversion.flattenDataArray(target_and_planned_quantities));
        $scope.datasetOverride.push({
            tension: 0,
            fill: false,
            radius: 1,
            hoverRadius: 3,
            steppedLine: true
        });

        // Set Status quantities
        var cumulative_quantities = {};
        for (var i = 0; i < labels.length; i++) {
            if (labels[i] <= now_label)
                cumulative_quantities[labels[i]] = 0
            else
                cumulative_quantities[labels[i]] = null
        }

        workflow.get().reverse().forEach(function (workflow_state) {
            var data_array = null;

            for (var i = 0; i < status_quantities.length; i++) {
                if (status_quantities[i]._id == workflow_state) {
                    data_array = data_conversion.mongoDBArray2LabelDict(labels, status_quantities[i].quantities);
                    break;
                }
            }

            for (var i = 0; i < labels.length && labels[i] <= now_label; i++)
                if (data_array != null)
                    cumulative_quantities[labels[i]] = cumulative_quantities[labels[i]] + data_array[labels[i]];

            $scope.series.push(workflow_state);
            $scope.data.push(data_conversion.flattenDataArray(cumulative_quantities));
            $scope.datasetOverride.push({
                tension: 0,
                radius: 1,
                hoverRadius: 3
            });
        });

        // Disable spinner
        $scope.loading_canvas = false;
    }

    $scope.$on('chart-create', function (event, chart) {
        document.getElementById('js-legend').innerHTML = chart.generateLegend();
    });
});
