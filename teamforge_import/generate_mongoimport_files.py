import json
from os import environ
from datetime import datetime

# Set the import timestamp
timestamp_string = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')

# Set the path variable
path = environ["TMP_DIR"] + "/" + environ["TRACKER"]

# Generate Lookup Table for planning folders and import timestamp to planning folders
with open(path + '/planning_folders_processed.json') as data_file:
   planning_folders = json.load(data_file)

planning_folder_lookup = {}
for i in range(len(planning_folders)):
   id = planning_folders[i]['id']
   title = planning_folders[i]['title']
   planning_folder_lookup[id] = {'planningFolderTitle': title}

# Add Folder Paths to Planning Folder Lookup
with open(path + '/planning_folder_trace.txt') as f:
   planning_folder_trace = f.readlines()

for line in planning_folder_trace:
   folder_trace = line.rstrip().split(',')
   # Trace the entire path, but ignore the last entry which is the 'PlanningApp...'
   while len(folder_trace) > 1:
      id = folder_trace[0]
      if id not in [i for i in planning_folder_lookup.keys() if
                    'planningFolderTrace' in planning_folder_lookup[i].keys()]:
         planning_folder_lookup[id]['planningFolderTrace'] = folder_trace
         planning_folder_lookup[id]['planningFolderDepth'] = len(folder_trace)
         planning_folder_lookup[id]['planningFolderPath'] = '>'.join(
            map(lambda x: planning_folder_lookup[x]['planningFolderTitle'], reversed(folder_trace[:-1])))
      folder_trace = folder_trace[1:]

# Add Planning Folder Trace and Planning Folder Path to planning folders
for i in range(len(planning_folders)):
   id = planning_folders[i]['id']
   if id in planning_folder_lookup:
      planning_folders[i]['planningFolderTrace'] = planning_folder_lookup[id]['planningFolderTrace']
      planning_folders[i]['planningFolderDepth'] = planning_folder_lookup[id]['planningFolderDepth']
      planning_folders[i]['planningFolderPath'] = planning_folder_lookup[id]['planningFolderPath']

   # Write Output File for planning Folders
with open(path + '/planning_folders_mongoimport.json', 'w') as outfile:
   json.dump(planning_folders, outfile)

# For the deliverables:
# - Convert any number string into a real JSON number
# - Add Timestamp information
# - Add Planning Folder Path, Planning Folder Timestamp, Planning Folder Depth and Planning Folder Trace

with open(path + '/deliverables_processed.json') as data_file:
   deliverables = json.load(data_file)

for i in range(len(deliverables)):
   for key in deliverables[i]:
      if deliverables[i][key] is not None and deliverables[i][key].isdigit():
         deliverables[i][key] = int(deliverables[i][key])
      elif deliverables[i][key] is not None and deliverables[i][key].replace('.', '', 1).isdigit():
         deliverables[i][key] = float(deliverables[i][key])

   planning_folder_id = deliverables[i]['planningFolderId']
   if planning_folder_id:
      deliverables[i]['planningFolderTitle'] = planning_folder_lookup[planning_folder_id]['planningFolderTitle']
      deliverables[i]['planningFolderPath'] = planning_folder_lookup[planning_folder_id]['planningFolderPath']
      deliverables[i]['planningFolderDepth'] = planning_folder_lookup[planning_folder_id]['planningFolderDepth']
      deliverables[i]['planningFolderTrace'] = planning_folder_lookup[planning_folder_id]['planningFolderTrace']

# Remove any Variable Names with whitespaces since we can't process them
def removeWhiteSpaces(dictionary):
   for key in dictionary.keys():
      if dictionary[key] is dict:
         removeWhiteSpaces(dictionary[key])
      if len(key.split()) > 1:
         new_key = ''.join(key.title().split())
         new_key = new_key[0].lower() + new_key[1:]
         dictionary[new_key] = dictionary.pop(key)


for deliverable in deliverables:
   removeWhiteSpaces(deliverable)

# Write Mongodb import file for deliverables
with open(path + '/deliverables_mongoimport.json', 'w') as outfile:
   json.dump(deliverables, outfile)




