from flask import Flask, jsonify
from sys import argv

HOST = argv[1]

with open("assets/saude_liraa.json", "r") as f:
    JSON_FILE = f.read()

app = Flask(__name__)

@app.route("/data.json")
def data_json():
    return app.response_class(
            response=JSON_FILE,
            status=200,
            mimetype="application/json")

app.run(host=HOST, port=3000)
