from flask import Flask, render_template, url_for, request
import json
import os
from ast import literal_eval

app = Flask(__name__)

SITE_ROOT = os.path.realpath(os.path.dirname(__file__)) #path of this file's parent directory
JSON_DIR = "static/json" #dir to save all the json files in

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html', title="HOME")

@app.route("/about")
def about():
    return render_template("about.html", title = "about me")

@app.route('/results')
def results():
    return render_template('data.html', content_json=getJsonData("content.json"), columns_json=getJsonData("columns.json"))


@app.route('/changeTableContent', methods=['POST'])
def changeTableContent():
	# read incoming json
    data = request.get_json(force=True) 
    changeJsonFile(data, "content.json")
    return ""

@app.route('/changeTableColumnNames', methods=['POST'])
def changeTableColumnNames():
	# read incoming json 
    data = request.get_json(force=True) 
    changeJsonFile(data, "columns.json")
    return ""

def getJsonData(filename):
    url = os.path.join(SITE_ROOT, JSON_DIR, filename)
    return json.load(open(url))

def changeJsonFile(data, filename):
    file_url = os.path.join(SITE_ROOT, JSON_DIR, filename)
    with open(file_url, 'w') as outfile:
        json.dump(data, outfile)
