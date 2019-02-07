# Author: Khushal Patel
# Date Created: Jan 2019

from flask import Flask, render_template, url_for, request, redirect, Markup
import json
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
    # row_path = url_for('static', filename='tables/table1/test_rows.json')
    # col_path = url_for('static', filename='tables/table1/test_cols.json')
    row_path = "test_rows.json"
    col_path = "test_cols.json"
    title_json = "test_title.json"
    return render_template('home.html', content_json=getJsonData("test_rows.json"), columns_json=getJsonData("test_cols.json"), rowPath=row_path, colPath=col_path, table_title=getJsonData(title_json))


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
    return render_template('tables.html', content_json=getJsonData("content.json"), columns_json=getJsonData("columns.json"), table_title=getJsonData("title.json"))


@app.route('/servers')
def servers():
    return render_template('tables.html', content_json=getJsonData("servers.json"), columns_json=getJsonData("server_cols.json"), table_title=getJsonData("serverTitle.json"))


@app.route('/edit_table')
def edit_table():
    # jsondata = literal_eval(request.args.get('jsondata'))
    # coldata = literal_eval(request.args.get('coldata'))
    # return render_template('data.html', content_json=getJsonData("content.json"), columns_json=getJsonData("columns.json"))
    return render_template('data.html', content_json=getJsonData("content.json"), columns_json=getJsonData("columns.json"), table_title=getJsonData("title.json"))

@app.route('/edit_table_array', methods=['POST'])
def edit_table_array():
    jsondata = request.get_json(force=True)
    # coldata = request.args.get('coldata')
    row_path = jsondata["rowpath"]
    col_path = jsondata["colpath"]
    tableTitleJson = jsondata["tableTitleJson"]
    print("**********************************************")
    # return redirect(url_for('data.html'), content_json=jsondata["rowdata"], columns_json=jsondata["coldata"], row_path=row_path, col_path=col_path, table_title=tableTitleJson)
    return redirect(url_for('data_edit', jsondata=jsondata))

@app.route('/data_edit')
def data_edit():
    # jsondata = request.get_json(force=True)
    jsondata = request.args['jsondata']
    # coldata = request.args.get('coldata')
    row_path = jsondata["rowpath"]
    col_path = jsondata["colpath"]
    tableTitleJson = jsondata["tableTitleJson"]
    return render_template('data.html', content_json=jsondata["rowdata"], columns_json=jsondata["coldata"], row_path=row_path, col_path=col_path, table_title=tableTitleJson)

@app.route('/submitRequest', methods=['POST'])
def submitRequest():
    # read incoming json
    json_arr = request.get_json(force=True)
    rowdata = json_arr["rowdata"]
    coldata = json_arr["coldata"]
    title_json = json_arr["tableTitleJson"]
    row_path = json_arr["rowpath"]
    col_path = json_arr["colpath"]

    saveFile(rowdata, row_path)
    saveFile(coldata, col_path)
    saveFile(data, "title.json")

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