from flask import Flask, render_template, url_for, request, redirect
# import json
# import os

# tables = list()
# for files in os.listdir('static/tables'):
#     if not files.startswith('.'): #ignore hidden files
#         tables.append(files)
# print (tables)

import glob
import os
import json
import re
# files = glob.glob("static/tables/table?/*")
# files.sort(key=os.path.getmtime)
# for fil in files:
#     print (fil)
#print(os.listdir("static/tables/table1"))

def extract_field(json_list, field_name):
    values = list()
    for pair in json_list:
        if field_name in pair.keys():
            values.append(pair[field_name])
    return values

with open('static/tables/table1/content.json') as f:
    data = json.load(f)
#print(json.dumps(data, indent=4, sort_keys=True)) #to pretty print json
names = extract_field(data, "Name")
print (names)
progress_list = extract_field(data, "progress")
print(progress_list)
num_list = list()
for s in progress_list:
    num_string = s.split("/")
    rr = re.findall("[-+]?[.]?[\d]+(?:,\d\d\d)*[\.]?\d*(?:[eE][-+]?\d+)?", num_string[0])
    print (rr)


