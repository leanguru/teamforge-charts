/*---------------------------------------------------------------------------------------------------------------------
 The Ui Grid Controller
 ---------------------------------------------------------------------------------------------------------------------*/

app.controller('uiGridCtrl', function ($scope, $http, uiGridConstants) {
    $scope.myData = [];
    $scope.columnDefs = [];

    var loadTracker = function (tracker, loading_array,parameters) {
        loading_array[tracker] = true;

        $http.get(restheart_config.base_url + tracker + "?pagesize=1000&filter=" + JSON.stringify(parameters[tracker].query)).then(
            function (response) {
                console.log(tracker);

                if (response.data._returned > 0) {
                    var data = response.data._embedded["rh:doc"];
                    // Rename columns and add columns
                    var rename_cols = Object.keys(parameters[tracker].field_mappings);
                    var preset_cols = Object.keys(parameters[tracker].preset_columns);

                    data.map(function (entry) {
                        for (var i in rename_cols) {
                            var old_field = rename_cols[i];
                            var new_field = parameters[tracker].field_mappings[old_field];
                            entry[new_field] = entry[old_field];
                            delete entry[old_field];
                        }
                        for (var i in preset_cols) {
                            var col = preset_cols[i];
                            entry[col] = parameters[tracker].preset_columns[col];
                        }
                        return entry;
                    });

                    $scope.myData = $scope.myData.concat(data);
                    console.log($scope.myData);
                }

                loading_array[tracker] = false;
                if (Object.keys(loading_array).every(function (v) { return !loading_array[v] })) {
                    $scope.loading = false;
                }
            },
            setUrlError);
    };


    /* The format of queries should be an object with following properties
     {

     <TRACKER_NAME>: {
     query : <MongoDB RESTHeart QUERY OBJECT>,
     field_mappings:
     {
     <FROM_FIELD_NAME> : <TO_FIELD_NAME>,
     <FROM_FIELD_NAME> : <TO_FIELD_NAME>,
     ...
     }
     preset_columns:
     {
     <COLUMN_NAME>: <VALUE>,
     <COLUMN_NAME>: <VALUE>,
     ...
     }
     }

     } */

    $scope.loading = false;
    $scope.$on('update-table', function (call, parameters) {

        if ($scope.loading == true) return;
        $scope.loading = true;

        console.log(parameters);
        $scope.myData = [];

        trackers = Object.keys(parameters);

        var loading_array = {};
        var columns = []
        for (var i in trackers) {
            loadTracker(trackers[i],loading_array,parameters);
            columns = columns.concat(parameters[trackers[i]].display_columns.filter(function (v) { return columns.indexOf(v) < 0 }));
        }

        console.log(columns)

        $scope.columnDefs = columns.map(function(v){return {field:v, aggregationType: uiGridConstants.aggregationTypes.sum}});
    });

    var setUrlError = function (response) {
        $scope.error_message = "Got HTTP " + response.status + " error while retrieving data: " + response.data.message;
    };


});