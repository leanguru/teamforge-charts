#!/bin/bash

# Settings
BASE_URL=cfdtest.leanguru.pro:8080/cfdtest/
TRACKERS=(<TRACKER> <TRACKER>)
MONGO_USER=<USERNAME>
MONGO_PASSWORD=<PASSWORD>

# Set aggregates for tracker itself
for TRACKER in "${TRACKERS[@]}"; do
echo "Configuring aggregate RestHeart URL's for "$TRACKER

# Configure aggregates for cumulative flow diagram
curl -i --user $MONGO_USER:$MONGO_PASSWORD -H 'Content-Type: application/json' -X PUT -d '{"aggrs": [
{"stages":[{"_$match":{"planningFolderTrace":{"_$var":"planning_folder"},"importTimestamp":{"_$gte": {"_$var":"datetime_from"}, "_$lte": {"_$var":"datetime_until"}}}},{"_$group":{"_id":{"importTimestamp":"$importTimestamp","status":"$status"},"qty":{"_$sum":{"_$var":"aggregation_field"}}}},{"_$sort":{"_id.status":1,"_id.importTimestamp":1}},{"_$group":{"_id":{"importTimestamp":{"_$substr":["$_id.importTimestamp",0,10]},"status":"$_id.status"},"qty":{"_$last":"$qty"}}},{"_$group":{"_id":"$_id.status","quantities":{"_$push":{"importTimestamp":"$_id.importTimestamp","qty":"$qty"}}}}], "type":"pipeline", "uri":"status_quantities"},
{"stages":[{"_$match":{"planningFolderTrace":{"_$var":"planning_folder"},"importTimestamp":{"_$gte": {"_$var":"datetime_from"}, "_$lte": {"_$var":"datetime_until"}}}},{"_$group":{"_id":"$importTimestamp","qty":{"_$sum":{"_$cond":[{"_$lte":[{"_$var":"planned_date_field"},"$importTimestamp"]},{"_$var":"aggregation_field"}, 0]}}}},{"_$group":{"_id":{"_$substr":["$_id",0,10]},"qty":{"_$last":"$qty"}}},{"_$project":{"importTimestamp":"$_id","qty":"$qty","_id":0}},{"_$sort":{"importTimestamp":1}}], "type":"pipeline", "uri":"target_quantities"},
{"stages":[{"_$match":{"planningFolderTrace":{"_$var":"planning_folder"}}},{"_$group":{"_id":{"importTimestamp":"$importTimestamp","plannedDate":{"_$substr":[{"_$var":"planned_date_field"},0,10]}},"qty":{"_$sum":{"_$var":"aggregation_field"}}}},{"_$group":{"_id":"$_id.importTimestamp","quantities":{"_$push":{"plannedDate":"$_id.plannedDate","qty":"$qty"}}}},{"_$sort":{"_id":-1}},{"_$limit":1},{"_$unwind":"$quantities"},{"_$project":{"importTimestamp":"$quantities.plannedDate","qty":"$quantities.qty","_id":0}},{"_$sort":{"importTimestamp":1}}], "type":"pipeline", "uri":"planned_quantities"}] }' $BASE_URL$TRACKER

# Set aggregates for workflows
curl -i --user $MONGO_USER:$MONGO_PASSWORD -H 'Content-Type: application/json' -X PUT -d '{"aggrs": [{"stages":[{"_$project":{"importTimestamp":1,"workflow":1,"length":{"_$size":"$workflow"}}},{"_$unwind":{"path":"$workflow","includeArrayIndex":"position"}},{"_$group":{"_id":"$workflow.value", "pos":{"_$avg":{"_$divide":["$position","$length"]}}}},{"_$sort":{"pos":1,"_id":1}}],"type":"pipeline", "uri":"list"}]}' $BASE_URL$TRACKER"_workflows"

# Set aggregates for planning folders
curl -i --user $MONGO_USER:$MONGO_PASSWORD -H 'Content-Type: application/json' -X PUT -d '{"aggrs": [{"stages":[{"_$match":{"planningFolderDepth":{"_$lte":{"_$var":"planningFolderDepth"}}}},{"_$sort":{"importTimestamp":1}},{"_$group":{"_id":"$planningFolderPath","id":{"_$last":"$id"},"parentFolderId":{"_$last":"$parentFolderId"},"status":{"_$last":"$status"}}},{"_$sort":{"_id":1}}], "type":"pipeline", "uri":"list"}]}' $BASE_URL$TRACKER"_planning_folders"
done