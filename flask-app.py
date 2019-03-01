# Author: Khushal Patel
# Date Created: Jan 2019

from flask import Flask, render_template, url_for, request, redirect, Markup
import json
import urllib.parse
import os, shutil
from ast import literal_eval
import re

app = Flask(__name__)

# path of this file's parent directory
SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
TABLE_DIR = SITE_ROOT + "/static/tables/"  # dir to save all the tables and their respective json files

@app.route("/")
@app.route("/home")
def home():
    # get table names from TABLE_DIR path
    #don't need the hidden directory/files or any files
    table_names = sorted([name for name in os.listdir(TABLE_DIR) if not name.startswith('.') and not os.path.isfile(name)])
    return render_template("home.html", table_names=table_names)


@app.route('/side')
def side():
    return render_template("side.html")

@app.route('/sidebar')
def sidebar():
    return render_template("sidebar.html")

@app.route('/getTableData', methods=['POST', 'GET'])
def getTableData():
    file_path = request.args.get('filepath')
    return json.dumps(json.load(open(os.path.join(TABLE_DIR, file_path)))) #get json data from /TABLE_DIR/file_path

@app.route('/add_table', methods=['POST', 'GET'])
def add_table():
    # table_dir_name = json.loads(request.args.get('jsondata'))["tableDir"] #get tableDir name (key) from the supplied json
    table_names = sorted([name for name in os.listdir(TABLE_DIR) if not name.startswith('.') and not os.path.isfile(name)])
    return render_template('data.html', table_names=table_names)

@app.route('/data_edit', methods=['POST', 'GET'])
def data_edit():
    table_dir_name = json.loads(request.args.get('jsondata'))["tableDir"] #get tableDir name (key) from the supplied json
    table_names = sorted([name for name in os.listdir(TABLE_DIR) if not name.startswith('.') and not os.path.isfile(name)])
    return render_template('data.html', table_dir_name=table_dir_name, table_names=table_names)


@app.route('/submitRequest', methods=['POST'])
def submitRequest():
    # read incoming json
    json_arr = request.get_json(force=True)

    rowdata = json_arr["rowdata"]
    coldata = json_arr["coldata"]
    table_title = json_arr["tabletitle"]
    old_table_dir_name = json_arr["oldTableDirName"]

    table_dir = table_title.replace(" ", "-")
    table_title_json = { "title": table_title }

    table_names = sorted([name for name in os.listdir(TABLE_DIR) if not name.startswith('.') and not os.path.isfile(name)])
    if (old_table_dir_name not in table_names):
        os.mkdir(os.path.join(TABLE_DIR, table_dir))
    else:
        os.rename(os.path.join(TABLE_DIR, old_table_dir_name), os.path.join(TABLE_DIR, table_dir))

    saveFile(rowdata, os.path.join(table_dir, "content.json"))
    saveFile(coldata, os.path.join(table_dir, "columns.json"))
    saveFile(table_title_json,os.path.join(table_dir, "title.json"))

    return ""


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
