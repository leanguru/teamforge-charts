#!/bin/bash
set -e

# Configure Tracker to be imported
TRACKER=<TRACKER>

# MongoDB Configuration
MONGO_DB=<MONGO_DB>

# Configuration of paths and scripts
TMP_DIR=/var/tmp/$MONGO_DB\_$TRACKER
CTF_CMD=/opt/collabnet/teamforge/add-ons/teamforge_cli/bin/ctf

# Create TMP_DIR if necessary
mkdir -p $TMP_DIR

# Export TMP_DIR variable so that they can be used in ctf cli
export TMP_DIR

# Export TRACKER variable so that they can be used in ctf cli
export TRACKER

# Export artifacts from teamforge
$CTF_CMD export_deliverables.ctf
head -n -1 $TMP_DIR/$TRACKER/deliverables.json > $TMP_DIR/deliverables_processed.json
echo "]" >> $TMP_DIR/deliverables_processed.json

jq -r ".[] | . + {k:\"002\"}" $TMP_DIR/deliverables_processed.json > $TMP_DIR/$TRACKER/deliverables_mongoimport.json


mongoimport -d $MONGO_DB -c $TRACKER --jsonArray $TMP_DIR/deliverables_mongoimport.json

# Remove Obsolete Entries
mongo $MONGO_DB --eval "collection='$TRACKER'; load('./remove_obsolete_entries.js')"

# Clean up
rm $TMP_DIR/deliverables.json
rm $TMP_DIR/deliverables_processed.json
rm $TMP_DIR/deliverables_mongoimport.json
