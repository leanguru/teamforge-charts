/*---------------------------------------------------------------------------------------------------------------------
 The Angular Application

 configurable with the following get parameters:

 - tracker
 - date_from
 - date_until
 - planned_date_field
 - aggregation_field
 - planning_folder
 - planning_folder_depth

 ---------------------------------------------------------------------------------------------------------------------*/

var app = angular.module('teamforgeChartsApp', ['ui.select', 'ngSanitize', 'chart.js']);

// Create Base64 Object
var Base64 = {_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    _utf8_encode: function (e) {
        e = e.replace(/rn/g, "n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
};

app.config(function ($locationProvider) {
    // use the HTML5 History API
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});


app.controller('cfdCtrl', function ($scope, $http, $location) {
    // Set Restheart Authentication
    if (restheart_config.username && restheart_config.password) {
        $http.defaults.headers.common.Authorization = "Basic " + Base64.encode(restheart_config.username + ":" + restheart_config.password);
    }

    $scope.planning_folders = [];

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

    // Define some helper functions
    var setUrlError = function (response) {
        $scope.error_message = "Got HTTP " + response.status + " error while retrieving data: " + response.data.message;
    };
    var readGetParameter = function (field_name, default_value) {
        var get_parameter = $location.search();
        if (Object.keys(get_parameter).indexOf(field_name) > -1)
            return get_parameter[field_name];
        else
            return default_value;
    };
    var createDataArray = function (labels, mongoDBArray) {
        var return_array = {};
        var value = 0;

        for (var i = 0; i < mongoDBArray.length; i++) return_array[mongoDBArray[i].importTimestamp] = mongoDBArray[i].qty;

        for (var i = 0; i < labels.length; i++) {
            if (return_array[labels[i]] != undefined) value = return_array[labels[i]];
            return_array[labels[i]] = value;
        }

        return return_array;
    };
    var flattenDataArray = function (DataArray) {
        var keys = Object.keys(DataArray).sort();
        return keys.map(function (v) {
            return DataArray[v];
        })
    };

    // Init function - to be loaded when graph is being generated
    $scope.init = function () {
        // Set loading flags
        $scope.loading_planning_folders = true;
        $scope.loading_canvas = true;

        // Set tracker
        $scope.tracker = readGetParameter('tracker')
        if (!$scope.tracker || $scope.tracker.substr(0, 7) != 'tracker') {
            $scope.error_message = "You must inform a tracker: '" + $scope.tracker + "' is not a valid tracker."
        }


        // Set dates
        var df = (new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10);
        $scope.date_from = new Date(readGetParameter('date_from', df) + "T12:00:00");

        var du = (new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10);
        $scope.date_until = new Date(readGetParameter('date_until', du) + "T12:00:00");

        // Set planned date field
        $scope.planned_date_field = readGetParameter('planned_date_field', 'plannedDate')

        // Set value types
        if (readGetParameter('aggregation_field', ''))
            $scope.aggregation_field = "'$" + readGetParameter('aggregation_field', '') + "'";
        else
            $scope.aggregation_field = 1;


        // Load and set Planning folders
        var planning_folder_depth = readGetParameter('planning_folder_depth', 3)
        var planning_folder_get_param = readGetParameter('planning_folder', null);

        var setPlanningFolders = function (response) {
            $scope.planning_folders = angular.copy(response.data._embedded["rh:result"]);

            $scope.planning_folders.unshift({
                id: $scope.planning_folders[0].parentFolderId,
                _id: '[root folder]'
            })

            $scope.planning_folder = $scope.planning_folders[0];
            if (planning_folder_get_param)
                for (var i = 0; i < $scope.planning_folders.length; i++)
                    if ($scope.planning_folders[i].id === planning_folder_get_param)
                        $scope.planning_folder = $scope.planning_folders[i];

            $scope.loading_planning_folders = false;
            $scope.getDataAndDraw();
        }

        $http.get(restheart_config.base_url + $scope.tracker + "_planning_folders/_aggrs/list?pagesize=1000&avars={'planningFolderDepth':" + planning_folder_depth + "}").then(setPlanningFolders, setUrlError);
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
        var workflow = null;
        var status_quantities = null;
        var target_quantities = null;
        var planned_quantities = null;

        // Get data
        $http.get(restheart_config.base_url + $scope.tracker + "_workflows/_aggrs/list").then(function (response) {
            workflow = response.data._embedded["rh:result"].map(function (val) {
                return val._id
            }).reverse();
            drawGraph(workflow, status_quantities, target_quantities, planned_quantities);
        }, setUrlError);

        $http.get(restheart_config.base_url + $scope.tracker + "/_aggrs/status_quantities?pagesize=1000&avars={'aggregation_field': " + $scope.aggregation_field + ",'planned_date_field': '$" + $scope.planned_date_field + "','planning_folder':'" + $scope.planning_folder.id + "','datetime_from':'" + $scope.date_from.toISOString().substr(0, 10) + "T00:00:00','datetime_until':'" + $scope.date_until.toISOString().substr(0, 10) + "T23:59:59'}").then(function (response) {
            status_quantities = response.data._embedded["rh:result"];
            drawGraph(workflow, status_quantities, target_quantities, planned_quantities);
        }, setUrlError);

        $http.get(restheart_config.base_url + $scope.tracker + "/_aggrs/target_quantities?pagesize=1000&avars={'aggregation_field': " + $scope.aggregation_field + ",'planned_date_field': '$" + $scope.planned_date_field + "','planning_folder':'" + $scope.planning_folder.id + "','datetime_from':'" + $scope.date_from.toISOString().substr(0, 10) + "T00:00:00','datetime_until':'" + $scope.date_until.toISOString().substr(0, 10) + "T23:59:59'}").then(function (response) {
            target_quantities = response.data._embedded["rh:result"];
            drawGraph(workflow, status_quantities, target_quantities, planned_quantities);
        }, setUrlError);

        $http.get(restheart_config.base_url + $scope.tracker + "/_aggrs/planned_quantities?pagesize=1000&avars={'aggregation_field': " + $scope.aggregation_field + ",'planned_date_field': '$" + $scope.planned_date_field + "','planning_folder':'" + $scope.planning_folder.id + "','datetime_from':'" + $scope.date_from.toISOString().substr(0, 10) + "T00:00:00','datetime_until':'" + $scope.date_until.toISOString().substr(0, 10) + "T23:59:59'}").then(function (response) {
            planned_quantities = response.data._embedded["rh:result"];
            drawGraph(workflow, status_quantities, target_quantities, planned_quantities);
        }, setUrlError);
    }

    var drawGraph = function (workflow, status_quantities, target_quantities, planned_quantities) {

        // Exit if workflow or status quanties aren't defined
        if (!workflow || !status_quantities || !target_quantities || !planned_quantities) {
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

        var target_quantities = createDataArray(labels, target_quantities)
        var planned_quantities = createDataArray(labels, planned_quantities)
        for (var i = 0; i < labels.length; i++) {
            if (labels[i] <= now_label)
                target_and_planned_quantities[labels[i]] = target_quantities[labels[i]]
            else
                target_and_planned_quantities[labels[i]] = planned_quantities[labels[i]]
        }

        $scope.series.push("Planned");
        $scope.data.push(flattenDataArray(target_and_planned_quantities));
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

        workflow.forEach(function (workflow_state) {
            var data_array = null;

            for (var i = 0; i < status_quantities.length; i++) {
                if (status_quantities[i]._id == workflow_state) {
                    data_array = createDataArray(labels, status_quantities[i].quantities);
                    break;
                }
            }

            for (var i = 0; i < labels.length && labels[i] <= now_label; i++)
                if (data_array != null)
                    cumulative_quantities[labels[i]] = cumulative_quantities[labels[i]] + data_array[labels[i]];

            $scope.series.push(workflow_state);
            $scope.data.push(flattenDataArray(cumulative_quantities));
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
