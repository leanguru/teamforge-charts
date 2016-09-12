#!/bin/bash

set -e

# Set Tracker to be imported
TRACKER=<TRACKER>

# Set MongoDB
MONGO_DB=<MONGO_DB>
MONGO_PORT=27017

# Configuration of paths and scripts
TMP_DIR=/tmp/$MONGO_DB
CTF_CMD=/opt/collabnet/teamforge/add-ons/teamforge_cli/bin/ctf

# Set timestamp string
TIMESTAMP=`date +%Y-%m-%dT%H:%M:%S`

# Export TMP_DIR variable so that they can be used in ctf cli
export TMP_DIR

# Make tmpdir for trackers
mkdir -p $TMP_DIR/$TRACKER

# Export TRACKER variable so that they can be used in ctf cli
export TRACKER

# Export artifacts from teamforge
$CTF_CMD export_deliverables.ctf
head -n -1 $TMP_DIR/$TRACKER/deliverables.json > $TMP_DIR/$TRACKER/deliverables_list.json
echo "]" >> $TMP_DIR/$TRACKER/deliverables_list.json

# Add Timestamp to deliverables
jq  'map( .+{importTimestamp:"'$TIMESTAMP'"} )' $TMP_DIR/$TRACKER/deliverables_list.json > $TMP_DIR/$TRACKER/deliverables_mongoimport.json

# Import into MongoDB
mongoimport -d $MONGO_DB --port $MONGO_PORT -c $TRACKER --jsonArray $TMP_DIR/$TRACKER/deliverables_mongoimport.json

# Clean up
rm $TMP_DIR/$TRACKER/deliverables.json
rm $TMP_DIR/$TRACKER/deliverables_mongoimport.json
rm $TMP_DIR/$TRACKER/deliverables_list.json
