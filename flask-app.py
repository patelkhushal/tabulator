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
TABLE_DIR = "static/tables/table1"  # dir to save all the table's json files in


@app.route("/")
@app.route("/home")
def home():
    jsons = getTableJsons(getTablesPaths())
    print (jsons)
    return render_template('home.html', jsons=jsons)
    # return render_template('home.html',\
    #     content_json=getJsonData("test_rows.json"),\
    #       columns_json=getJsonData("test_cols.json"),\
    #         row_path="test_rows.json",\
    #             col_path="test_cols.json",\
    #                 table_title=getJsonData("test_title.json"),\
    #                     title_path="test_title.json")


def getTableJsons(tablePaths):
    jsons = list()
    for table in tablePaths:
        table_jsons = list()
        for json in table:
            table_jsons.append(getJsonDatafromPath(json))
        jsons.append(table_jsons)
    return jsons

def getJsonDatafromPath(path):
    print(path)
    return json.load(open(path))

#returs a list of list where each list contains row, column and title json of all the tables in tables directory
def getTablesPaths():
    tables_path = list()
    for root, dirs, files in os.walk(os.path.abspath(SITE_ROOT+TABLE_DIR)):
        for directory in dirs:
            tables_path.append(os.path.join(root, directory))
    tables_path = sorted(tables_path)

    tables = list()
    for table in tables_path:
        table_jsons = sorted(os.listdir(table))
        table_jsons_path = list()
        for filename in table_jsons:
            if not filename.startswith('.'):
                table_jsons_path.append(os.path.join(table, filename))
        tables.append(sorted(table_jsons_path))

    return tables
    
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
