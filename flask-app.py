# Author: Khushal Patel
# Date Created: Jan 2019

from flask import Flask, render_template, url_for, request, redirect, Markup
import json
import urllib.parse
import os
from ast import literal_eval
import re

app = Flask(__name__)

# path of this file's parent directory
SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
TABLE_DIR = SITE_ROOT + "/static/tables/"  # dir to save all the tables and their respective json files

@app.route("/")
@app.route("/home")
def home():
    # get total number of table directories from TABLE_DIR path
    total_tables = len([name for name in os.listdir(TABLE_DIR) if not name.startswith('.') and not os.path.isfile(name)]) #don't need the hidden directory/files or any files
    return render_template('home.html', total_tables=total_tables)
    # return render_template('home.html',\
    #     content_json=getJsonData("test_rows.json"),\
    #       columns_json=getJsonData("test_cols.json"),\
    #         row_path="test_rows.json",\
    #             col_path="test_cols.json",\
    #                 table_title=getJsonData("test_title.json"),\
    #                     title_path="test_title.json")

@app.route('/getTableData', methods=['POST', 'GET'])
def getTableData():
    file_path = request.args.get('filepath')
    print("*********huiherfjerbfjkerjkfnkjenrfjkneklrnfk*************")

    return json.dumps(json.load(open(os.path.join(TABLE_DIR, file_path)))) #get json data from /TABLE_DIR/file_path

    
def extract_field(json_list, field_name):
    values = list()
    for pair in json_list:
        if field_name in pair.keys():
            values.append(pair[field_name])
    return values


def get_num_values(string_list):
    num_list = list()
    values = list()
    for s in string_list:
        num_string = s.split("/")
        rr = re.findall(
            "[-+]?[.]?[\d]+(?:,\d\d\d)*[\.]?\d*(?:[eE][-+]?\d+)?", num_string[0])
        values.append(int(rr[0]))
    return values


@app.route("/dashboard")
def chart():
    # labels = ["January", "February", "March",
    #           "April", "May", "June", "July", "August"]
    # values = [10, 9, 8, 7, 6, 4, 7, 8]
    extract_cols = ["p1", "p2", "progress"]
    with open('static/tables/table1/content.json') as f:
        data = json.load(f)
    # print(json.dumps(data, indent=4, sort_keys=True)) #to pretty print json
    labels = extract_field(data, "User")
    # print(names)
    values = extract_field(data, "Progress")
    values = get_num_values(values)
    # print(progress_list)
    return render_template('chart.html', values=values, labels=labels)


@app.route('/results')
def results():
    return render_template('tables.html',\
        content_json=getJsonData("content.json"),\
          columns_json=getJsonData("columns.json"),\
            row_path="content.json",\
                col_path="columns.json",\
                    table_title=getJsonData("title.json"),\
                        title_path="title.json")


@app.route('/data_edit', methods=['POST', 'GET'])
def data_edit():
    jsondata = json.loads(request.args.get('jsondata'))
    return render_template('data.html',\
        content_json=jsondata["rowdata"],\
            columns_json=jsondata["coldata"],\
                row_path=jsondata["rowpath"],\
                    col_path=jsondata["colpath"],\
                        table_title=jsondata["tableTitleJson"],\
                            title_path=jsondata["titlepath"])


@app.route('/submitRequest', methods=['POST'])
def submitRequest():
    # read incoming json
    json_arr = request.get_json(force=True)
    rowdata = json_arr["rowdata"]
    coldata = json_arr["coldata"]
    title_json = json_arr["tableTitleJson"]
    row_path = json_arr["rowpath"]
    col_path = json_arr["colpath"]
    title_path = json_arr["titlepath"]

    print(row_path)
    saveFile(rowdata, row_path)
    saveFile(coldata, col_path)
    saveFile(title_json,title_path)

    return ""


@app.route('/changeTableContent', methods=['POST'])
def changeTableContent():
    # read incoming json
    data = request.get_json(force=True)
    saveFile(data, "content.json")
    return ""


@app.route('/changeTableColumnNames', methods=['POST'])
def changeTableColumnNames():
    # read incoming json
    data = request.get_json(force=True)
    saveFile(data, "columns.json")
    return ""


@app.route('/changeTableTitle', methods=['POST'])
def changeTableTitle():
    # read incoming json
    data = request.get_json(force=True)
    saveFile(data, "title.json")
    return ""


def getTableTitle(filename):
    url = os.path.join(SITE_ROOT, TABLE_DIR, filename)
    data = json.load(open(url))
    return data["title"]


def getJsonData(filename):
    url = os.path.join(SITE_ROOT, TABLE_DIR, filename)
    return json.load(open(url))


def saveFile(data, filename):
    file_url = os.path.join(SITE_ROOT, TABLE_DIR, filename)
    with open(file_url, 'w') as outfile:
        json.dump(data, outfile, indent=4)


if __name__ == "__main__":
    app.run(debug=True)
