/*---------------------------------------------------------------------------------------------------------------------
 The Angular Application
 ---------------------------------------------------------------------------------------------------------------------*/

var app = angular.module('teamforgeChartsApp', ['chart.js']);

// Configure authentication for RESTHeart requests
app.config(function ($httpProvider) {
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

    if (restheart_config.username && restheart_config.password) {
        $httpProvider.defaults.headers.common.Authorization = "Basic " + Base64.encode(restheart_config.username + ":" + restheart_config.password);
    }
});

/*---------------------------------------------------------------------------------------------------------------------
 Create a data_conversion factory object
 ---------------------------------------------------------------------------------------------------------------------*/

app.factory('data_conversion', function () {
    var data_conversion = {};

    data_conversion.mongoDBArray2LabelDict = function (labels, mongoDBArray) {
        var return_array = {};
        var value = 0;

        for (var i = 0; i < mongoDBArray.length; i++) return_array[mongoDBArray[i].importTimestamp] = mongoDBArray[i].qty;

        for (var i = 0; i < labels.length; i++) {
            if (return_array[labels[i]] != undefined) value = return_array[labels[i]];
            return_array[labels[i]] = value;
        }

        return return_array;
    };

    data_conversion.flattenDataArray = function (DataArray) {
        var keys = Object.keys(DataArray).sort();
        return keys.map(function (v) {
            return DataArray[v];
        })
    };

    return data_conversion;
});

/*---------------------------------------------------------------------------------------------------------------------
 The CFD Controller for cumulative flow diagrams
 ---------------------------------------------------------------------------------------------------------------------*/

app.controller('cfdCtrl', function ($scope, $http, data_conversion, parameter, planning_folders, workflow) {

    // Set dates
    var tracker = 'tracker88228'
    var workflow = ['Backlog','WIP','Done']
    var date_from = (new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10);
    var date_until = (new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10);

    // Init function - to be loaded when graph is being generated
    $scope.init = function () {
        // Set loading flags
        $scope.loading_canvas = true;

        $http.get(restheart_config.base_url + tracker + "/_aggrs/status_quantities_plain?pagesize=1000&avars={'datetime_from':'" + date_from.toISOString().substr(0, 10) + "T00:00:00','datetime_until':'" + date_until.toISOString().substr(0, 10) + "T23:59:59'}").then(
            function (response) {
                var status_quantities = response.data._embedded["rh:result"];
                drawGraph(status_quantities);
            });
    }

    var drawGraph = function (status_quantities) {

        // Reset all data
        $scope.labels = [];
        $scope.series = [];
        $scope.data = [];
        $scope.datasetOverride = [];

        // Set x-axis labels
        var labels = [];
        var now_label = new Date().toISOString().substring(0, 10);
        for (var d = date_from; d <= date_to; d.setDate(d.getDate() + 1)) labels.push(d.toISOString().substring(0, 10));
        $scope.labels = labels;


        // Set Status quantities
        var cumulative_quantities = {};
        for (var i = 0; i < labels.length; i++) {
            if (labels[i] <= now_label)
                cumulative_quantities[labels[i]] = 0
            else
                cumulative_quantities[labels[i]] = null
        }

        workflow.reverse().forEach(function (workflow_state) {
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

    // Put legend on a side bar
    $scope.$on('chart-create', function (event, chart) {
        document.getElementById('js-legend').innerHTML = chart.generateLegend();
    });

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
});

