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
    return render_template('home.html', title="HOME")


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
        rr = re.findall("[-+]?[.]?[\d]+(?:,\d\d\d)*[\.]?\d*(?:[eE][-+]?\d+)?", num_string[0])
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
    labels = extract_field(data, "Name")
    #print(names)
    values = extract_field(data, "progress")
    values = get_num_values(values)
    #print(progress_list)
    return render_template('chart.html', values=values, labels=labels)


@app.route("/about")
def about():
    return render_template("about.html", title="about me")


@app.route('/results')
def results():
    return render_template('tables.html', content_json=getJsonData("content.json"), columns_json=getJsonData("columns.json"))


@app.route('/edit_table')
def edit_table():
    # jsondata = literal_eval(request.args.get('jsondata'))
    # coldata = literal_eval(request.args.get('coldata'))
    # return render_template('data.html', content_json=getJsonData("content.json"), columns_json=getJsonData("columns.json"))
    return render_template('data.html', content_json=getJsonData("content.json"), columns_json=getJsonData("columns.json"))


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


def getJsonData(filename):
    url = os.path.join(SITE_ROOT, TABLE_DIR, filename)
    return json.load(open(url))


def saveFile(data, filename):
    file_url = os.path.join(SITE_ROOT, TABLE_DIR, filename)
    with open(file_url, 'w') as outfile:
        json.dump(data, outfile)
