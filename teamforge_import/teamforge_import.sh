#!/bin/bash
set -e

TRACKERS=(<TRACKER> <TRACKER>)
MONGO_DB=cfdtest
MONGO_USER=<USER>
MONGO_PWD=<PASWORD>
TMP_DIR=/tmp
CTF_CMD=/opt/collabnet/teamforge/add-ons/teamforge_cli/bin/ctf

# Export TMP_DIR variable so that they can be used in ctf cli
export TMP_DIR

# Make tmpdir for trackers
if [ ! -d $TMP_DIR/$TRACKER ]
then
mkdir $TMP_DIR/$TRACKER
fi

# Loop through all trackers
for TRACKER in "${TRACKERS[@]}"; do

# Export TRACKER variable so that they can be used in ctf cli
export TRACKER

# Export artifacts from teamforge
$CTF_CMD export_deliverables.ctf
head -n -1 $TMP_DIR/$TRACKER/deliverables.json > $TMP_DIR/$TRACKER/deliverables_processed.json
echo "]" >> $TMP_DIR/$TRACKER/deliverables_processed.json

# Generate list of all planning folders which appear in exported artifacts
echo "PlanningFolderId" > $TMP_DIR/$TRACKER/planning_folder_list_for_trace.csv
cat $TMP_DIR/$TRACKER/deliverables_processed.json | jq '.[] | .planningFolderId' | gawk -F "\"" '{print $2}' | sort | uniq | tail -n +2 >> $TMP_DIR/$TRACKER/planning_folder_list_for_trace.csv

# Trace artifacts
$CTF_CMD export_planning_folder_trace.ctf

# Generate list of all relevant Planning Folder
echo "PlanningFolderId" > $TMP_DIR/$TRACKER/planning_folder_list_for_export.csv
cat $TMP_DIR/$TRACKER/planning_folder_trace.txt | tr ',' '\n' | sort | uniq | grep plan >> $TMP_DIR/$TRACKER/planning_folder_list_for_export.csv

# Export planning folders from teamforge
$CTF_CMD export_planning_folders.ctf
head -n -1 $TMP_DIR/$TRACKER/planning_folders.json > $TMP_DIR/$TRACKER/planning_folders_processed.json 
echo "]" >>  $TMP_DIR/$TRACKER/planning_folders_processed.json

# Export Workflow for tracker
$CTF_CMD export_workflow.ctf
echo '{"workflow":' > $TMP_DIR/$TRACKER/workflow_processed.json 
cat $TMP_DIR/$TRACKER/workflow.json >> $TMP_DIR/$TRACKER/workflow_processed.json 
echo "}" >> $TMP_DIR/$TRACKER/workflow_processed.json

# Generate mongoimport json files
python generate_mongoimport_files.py

# Import into MongoDB
if [[ $MONGO_USER ]]
then
mongoimport -u $MONGO_USER -p $MONGO_PWD -d $MONGO_DB --authenticationDatabase admin -c $TRACKER --jsonArray $TMP_DIR/$TRACKER/deliverables_mongoimport.json
mongoimport -u $MONGO_USER -p $MONGO_PWD -d $MONGO_DB --authenticationDatabase admin -c $TRACKER"_planning_folders" --jsonArray $TMP_DIR/$TRACKER/planning_folders_mongoimport.json
mongoimport -u $MONGO_USER -p $MONGO_PWD -d $MONGO_DB --authenticationDatabase admin -c $TRACKER"_workflows" --type json $TMP_DIR/$TRACKER/workflow_mongoimport.json
else
mongoimport -d $MONGO_DB -c $TRACKER --jsonArray $TMP_DIR/$TRACKER/deliverables_mongoimport.json
mongoimport -d $MONGO_DB -c $TRACKER"_planning_folders" --jsonArray $TMP_DIR/$TRACKER/planning_folders_mongoimport.json
mongoimport -d $MONGO_DB -c $TRACKER"_workflows" --type json $TMP_DIR/$TRACKER/workflow_mongoimport.json
fi


# Remove Obsolete Entries
if [[ $MONGO_USER ]]
then
mongo -u $MONGO_USER -p $MONGO_PWD $MONGO_DB --authenticationDatabase admin --eval "collection='$TRACKER'; load('./remove_obsolete_entries.js')"
mongo -u $MONGO_USER -p $MONGO_PWD $MONGO_DB --authenticationDatabase admin --eval "collection='$TRACKER\_planning_folders'; load('./remove_obsolete_entries.js')"
mongo -u $MONGO_USER -p $MONGO_PWD $MONGO_DB --authenticationDatabase admin --eval "collection='$TRACKER\_workflows'; load('./remove_obsolete_entries.js')"
else
mongo $MONGO_DB --eval "collection='$TRACKER'; load('./remove_obsolete_entries.js')"
mongo $MONGO_DB --eval "collection='$TRACKER\_planning_folders'; load('./remove_obsolete_entries.js')"
mongo $MONGO_DB --eval "collection='$TRACKER\_workflows'; load('./remove_obsolete_entries.js')"
fi

# Clean up
rm $TMP_DIR/$TRACKER/deliverables.json
rm $TMP_DIR/$TRACKER/deliverables_mongoimport.json
rm $TMP_DIR/$TRACKER/deliverables_processed.json
rm $TMP_DIR/$TRACKER/planning_folder_trace.txt
rm $TMP_DIR/$TRACKER/planning_folder_list_for_export.csv
rm $TMP_DIR/$TRACKER/planning_folder_list_for_trace.csv
rm $TMP_DIR/$TRACKER/planning_folders.json
rm $TMP_DIR/$TRACKER/planning_folders_mongoimport.json
rm $TMP_DIR/$TRACKER/planning_folders_processed.json
rm $TMP_DIR/$TRACKER/workflow.json
rm $TMP_DIR/$TRACKER/workflow_mongoimport.json
rm $TMP_DIR/$TRACKER/workflow_processed.json

# END of Loop
done