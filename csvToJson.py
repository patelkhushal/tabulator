# Author: Khushal Patel
# Date Created: Fri  1 Feb 2019

import csv
import json

columns = list() #column list
column_dict = dict() #column dict to hold single tabulator column definition
col_dict_list = list() #collection of column dictionary objects. This will be the column definition of the table

row_dict = dict() #row dict to hold single tabulator row
row_dict_list = list() #collection of row dictionary objects. This will be the row contents of the table

counter = 0 #keep track of total number of rows and to add first csv row as column

with open('SVT_machines.csv', 'r', encoding='utf-8-sig') as csvFile:
    reader = csv.reader(csvFile)
    for row in reader:
        counter = counter + 1
        if counter == 1:
            columns = row #first row of the csv is column names
        else:
            i = 0
            for value in row: #each cell in one row
                row_dict[columns[i]] = row[i] #map column value to row value
                i = i + 1
            row_dict_list.append(row_dict)
            row_dict = dict()


for column in columns: #standard column definition for each tabulator columns
    column_dict["field"] = column
    column_dict["title"] = column
    column_dict["formatter"] = "textarea"
    column_dict["headerFilter"] = True
    column_dict["headerFilterPlaceholder"] = "Search..."
    col_dict_list.append(column_dict)
    column_dict = dict() #reset the dict to add next values

#save row and col dict list to a json file for tabulator to read
with open('servers.json', 'w') as fp:
    json.dump(row_dict_list, fp, indent=4)
with open('server_cols.json', 'w') as fp:
    json.dump(col_dict_list, fp, indent=4)

csvFile.close()