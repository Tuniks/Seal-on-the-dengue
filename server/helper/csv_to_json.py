#!/usr/bin/env python3

from argparse import ArgumentParser
from csv import reader, field_size_limit
from re import sub
import json
import sys

def normalize_coords(coord):
    c = coord.split(" ")
    return {"lng": float(c[0]), "lat": float(c[1])}

if __name__ == "__main__":
    field_size_limit(sys.maxsize)

    parser = ArgumentParser(description="Convert CSV to JSON")
    parser.add_argument("filename", type=str, help="path to CSV file")
    args = parser.parse_args()

    filename = args.filename 

    _list = []
    with open(filename, 'r', newline='') as csv:
        r = reader(csv)
        headers = []
        for index, row in enumerate(r):
            if index == 0:
                headers = row
                continue

            obj = {}
            for index, row in enumerate(row):
                if row.startswith("MULTIPOLYGON"):
                    row = list(map(normalize_coords,
                                   row.replace("MULTIPOLYGON", "")
                                      .replace("(", "") 
                                      .replace(")", "")
                                      .strip()
                                      .split(", ")))

                obj[headers[index]] = row
            _list += [obj]
    with open(filename.replace("csv", "json"), "w") as f:
        f.write(json.dumps(_list))
