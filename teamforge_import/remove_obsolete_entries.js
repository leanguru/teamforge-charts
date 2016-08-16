last_timestamps = db[collection].aggregate([{$sort:{importTimestamp:1}},{$group:{_id:{$substr:["$importTimestamp",0,10]},importTimestamp:{$last:"$importTimestamp"}}}],{allowDiskUse:true}).toArray().map(function(e) { return e.importTimestamp; })
print(last_timestamps)
db[collection].remove({importTimestamp: {$nin: last_timestamps}})

