#!/bin/bash

#-----------------------------------------------------------------
#
# Run this script in order to configure the Restheart Aggregation
# Pipelines
#
# 19/08/2016 - Christian Gut
#
# -----------------------------------------------------------------

# Restheart Configuration
RESTHEART_BASE_URL=<HOST>:<PORT>/<MONGODB>/
RESTHEART_USER=<USERNAME>
RESTHEART_PASSWORD=<PASSWORD>

# Configure aggregates for cumulative flow diagram
curl -i --insecure --user $RESTHEART_USER:$RESTHEART_PASSWORD -H 'Content-Type: application/json' -X PUT -d '{"aggrs": [
{"stages":[{"_$match":{"importTimestamp":{"_$gte": {"_$var":"datetime_from"}, "_$lte": {"_$var":"datetime_until"}}}},{"_$group":{"_id":{"importTimestamp":"$importTimestamp","status":"$status"},"qty":{"_$sum":1}}},{"_$sort":{"_id.status":1,"_id.importTimestamp":1}},{"_$group":{"_id":{"importTimestamp":{"_$substr":["$_id.importTimestamp",0,10]},"status":"$_id.status"},"qty":{"_$last":"$qty"}}},{"_$group":{"_id":"$_id.status","quantities":{"_$push":{"importTimestamp":"$_id.importTimestamp","qty":"$qty"}}}}], "type":"pipeline", "uri":"status_quantities"}] }' $RESTHEART_BASE_URL$TRACKER

