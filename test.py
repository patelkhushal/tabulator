import csv
import json
import os
from flask import Flask, render_template, url_for, request, redirect, Markup

SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
TABLE_DIR = "/static/tables/"  # dir to save all the table's json files in

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
        table_jsons_path.append(os.path.join(table, filename))
    tables.append(sorted(table_jsons_path))


def getTablePaths():
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
        table_jsons_path.append(os.path.join(table, filename))
    tables.append(sorted(table_jsons_path))

print(tables)
