from flask import Flask, request
from sys import argv
from sqlite3 import connect

HOST = argv[1]
CONN = connect("db.db")

with open("assets/saude_liraa.json", "r") as f:
    JSON_FILE = f.read()

app = Flask(__name__)

c = CONN.cursor()
c.execute("CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT, report TEXT NOT NULL)");

CONN.commit()

@app.route("/data.json")
def data_json():
    return app.response_class(
            response=JSON_FILE,
            status=200,
            mimetype="application/json")

@app.route("/ocorrido", methods=["POST"])
def report():
    report = request.form.get("report") or ""

    if report == "":
        return '{"success": false}'

    CONN.execute("INSERT INTO reports (report) VALUES (?)", (report,))
    CONN.commit()

    return '{"success": true}'

app.run(host=HOST, port=3000)
