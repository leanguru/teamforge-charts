#!/bin/bash

# List all trackers to be imported
TRACKER=<TRACKER>

# Restheart Configuration
RESTHEART_BASE_URL=<HOST>:<PORT>/<MONGODB>/

# Configure aggregates for cumulative flow diagram
curl -i --insecure  -H 'Content-Type: application/json' -X PUT -d '{"aggrs": [
{"stages":[{"_$match":{"importTimestamp":{"_$gte": {"_$var":"datetime_from"}, "_$lte": {"_$var":"datetime_until"}}}},{"_$group":{"_id":{"importTimestamp":"$importTimestamp","status":"$status"},"qty":{"_$sum":1}}},{"_$sort":{"_id.status":1,"_id.importTimestamp":1}},{"_$group":{"_id":{"importTimestamp":{"_$substr":["$_id.importTimestamp",0,10]},"status":"$_id.status"},"qty":{"_$last":"$qty"}}},{"_$group":{"_id":"$_id.status","quantities":{"_$push":{"importTimestamp":"$_id.importTimestamp","qty":"$qty"}}}}], "type":"pipeline", "uri":"status_quantities"},
{"stages":[{"_$match":{"importTimestamp":{"_$gte": {"_$var":"datetime_from"}, "_$lte": {"_$var":"datetime_until"}}}},{"_$group":{"_id":"$importTimestamp","qty":{"_$sum":{"_$cond":[{"_$lte":[{"_$var":"planned_date_field"},"$importTimestamp"]},1, 0]}}}},{"_$group":{"_id":{"_$substr":["$_id",0,10]},"qty":{"_$last":"$qty"}}},{"_$project":{"importTimestamp":"$_id","qty":"$qty","_id":0}},{"_$sort":{"importTimestamp":1}}], "type":"pipeline", "uri":"target_quantities"},
{"stages":[{"_$group":{"_id":{"importTimestamp":"$importTimestamp","plannedDate":{"_$substr":[{"_$var":"planned_date_field"},0,10]}},"qty":{"_$sum":1}}},{"_$group":{"_id":"$_id.importTimestamp","quantities":{"_$push":{"plannedDate":"$_id.plannedDate","qty":"$qty"}}}},{"_$sort":{"_id":-1}},{"_$limit":1},{"_$unwind":"$quantities"},{"_$project":{"importTimestamp":"$quantities.plannedDate","qty":"$quantities.qty","_id":0}},{"_$sort":{"importTimestamp":1}}], "type":"pipeline", "uri":"planned_quantities"}] }' $RESTHEART_BASE_URL$TRACKER

