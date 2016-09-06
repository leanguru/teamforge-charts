/*---------------------------------------------------------------------------------------------------------------------
 The Angular Application
 ---------------------------------------------------------------------------------------------------------------------*/

var app = angular.module('teamforgeChartsApp', ['ui.select', 'ngSanitize', 'chart.js']);

// Configure location provider in order to allow to manipulate get parameter
app.config(function ($locationProvider) {
    // use the HTML5 History API
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

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
 Create a parameter factory object
 ---------------------------------------------------------------------------------------------------------------------*/

app.factory('parameter', ['$location', function ($location) {
    var parameter = {};
    parameter.get = function (field_name, default_value) {
        var get_parameter = $location.search();
        if (Object.keys(get_parameter).indexOf(field_name) > -1)
            return get_parameter[field_name];
        else
            return default_value;
    }
    return parameter
}]);

/*---------------------------------------------------------------------------------------------------------------------
 Create a planning_folders factory
 ---------------------------------------------------------------------------------------------------------------------*/

app.factory('planning_folders', ['$http', '$q', function ($http, $q) {
    var planning_folders = {};
    var planning_folder_list = null;
    var planning_folder_depth = 3;
    var tracker = null;

    planning_folders.setTracker = function (tracker_id) {
        tracker = tracker_id
    };

    planning_folders.setPlanningFolderDepth = function (planning_folder_depth) {
        planning_folder_depth = planning_folder_depth
    };

    planning_folders.fetch = function () {
        return $q(function (resolve, reject) {
            var setPlanningFolders = function (response) {
                planning_folder_list = angular.copy(response.data._embedded["rh:result"]);

                if (planning_folder_list.length > 0) {
                    planning_folder_list.unshift({
                        id: planning_folder_list[0].parentFolderId,
                        _id: '[root folder]'
                    });
                    resolve();
                }
            }


            $http.get(restheart_config.base_url + tracker + "_planning_folders/_aggrs/list?pagesize=1000&avars={'planningFolderDepth':" + planning_folder_depth + "}").then(setPlanningFolders, reject);
        });
    };

    planning_folders.getList = function () {
        if (planning_folder_list == null) planning_folders.fetch();
        return planning_folder_list;
    };

    planning_folders.getIndex = function (planning_folder_id) {
        for (var i = 0; i < planning_folders.length; i++)
            if (planning_folders[i].id = planning_folder_id) return i;
        return null;
    };

    planning_folders.getItem = function (planning_folder_id) {
        var index = planning_folders.getIndex(planning_folder_id);
        if (index == null) {
            return null
        } else {
            return planning_folder_list[index];
        }
    }

    return planning_folders
}]);

/*---------------------------------------------------------------------------------------------------------------------
 Create a workflow factory
 ---------------------------------------------------------------------------------------------------------------------*/

app.factory('workflow', ['$http', '$q', function ($http, $q) {
    var workflow = {};
    var workflow_list = null;
    var tracker = null;

    workflow.setTracker = function (tracker_id) {
        tracker = tracker_id
    };

    workflow.subscribe = function (fn) {
        subscribers.push(fn);
    };

    workflow.fetch = function () {
        return $q(function (resolve, reject) {
            var setWorkflow = function (response) {
                workflow_list = response.data._embedded["rh:result"].map(function (val) {
                    return val._id
                });

                resolve();
            }

            $http.get(restheart_config.base_url + tracker + "_workflows/_aggrs/list").then(setWorkflow, reject);
        });
    };

    workflow.get = function () {
        if (workflow_list == null) workflow.fetch();
        return workflow_list;
    };

    return workflow
}]);

