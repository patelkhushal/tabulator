import csv
import json






# columns = list()
# column_dict = dict()
# col_dict_list = list()

# row_dict = dict()
# row_dict_list = list()

# counter = 0

# with open('data.csv', 'r') as csvFile:
#     reader = csv.reader(csvFile)
#     for row in reader:
#         counter = counter + 1
#         if counter == 1:
#             columns = row
#         else:
#             i = 0
#             for value in row:
#                 row_dict[columns[i]] = row[i]
#                 i = i + 1
#             row_dict_list.append(row_dict)
#             row_dict = dict()


# for column in columns:
#     column_dict["field"] = column
#     column_dict["title"] = column
#     column_dict["formatter"] = "textarea"
#     column_dict["headerFilter"] = True
#     column_dict["headerFilterPlaceholder"] = "Search..."
#     col_dict_list.append(column_dict)
#     column_dict = dict()

# with open('test_rows.json', 'w') as fp:
#     json.dump(row_dict_list, fp, indent=4)

# with open('test_cols.json', 'w') as fp:
#     json.dump(col_dict_list, fp, indent=4)

# csvFile.close()