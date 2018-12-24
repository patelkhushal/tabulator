from flask import Flask, render_template, url_for, request
import json
import os

app = Flask(__name__)

names = {"kp", "Ap"}


@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html', names=names, title="HOME")


@app.route('/results')
def results():
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "static", "content.json")
    data = json.load(open(json_url))
    return render_template('data.html', data=data)


@app.route('/receiver', methods=['POST'])
def receiver():
	# read json + reply
    data = request.get_json()
    result = ''
    for item in data:
        print (item)
    print(type(data))
    print(data)
    return result

@app.route("/about")
def about():
    return render_template("about.html", title = "about me")
