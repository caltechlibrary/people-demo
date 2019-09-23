#!/usr/bin/env python3

import sys
from datetime import datetime
from py_dataset import dataset

#
# Loop through the keys, fetch the record and append a _Key: "deposit" to
# each object.
#

c_name = "people.ds"
keys = dataset.keys(c_name)
#print(f"DEBUG Keys: {keys}")
for key in keys:
    print(f"Fixing key {key}")
    data, err = dataset.read(c_name, key)
    if err != "":
        print(f"Error read {c_name} -> {key}, {err}")
        sys.exit(1)
    # Make fieldname lower case
    dt = datetime.now().isoformat(' ')
    obj = {
            "_Key": key,
            "_State": "deposit",
            "_Updated": f"{dt}",
            "_Created": f"{dt}"
    }
    for field in data:
        if not ' ' in fkey:
            fkey = field.lower()
            obj[fkey] = data[field]
    err = dataset.update(c_name, key, obj)
    if err != "":
        print(f"Error write {c_name} -> {key}, {err}")
        sys.exit(1)
