import sys
import subprocess
from flask import Flask
from flask import Response
from http import HTTPStatus
import json
from flask_cors import CORS


class ProcessPort:

    def __init__(self, name, pid, address) -> None:
        self.name = name
        self.pid = pid
        self.port = self.extract_port(address)

    def extract_port(self, address) -> int:
        chunks = address.split(":", 2)
        port_string = chunks[1]
        return int(port_string.split("->")[0])
    
    def to_string(self):
        return "{} ({}) -> {}".format(self.name, self.pid, self.port)
        
class Process:
    def __init__(self, name, pid, ports) -> None:
        self.name = name
        self.pid = pid
        self.ports = ports

    def to_string(self) -> str:
        return "{} ({}) using {}".format(self.name, self.pid, self.ports)

    def to_dict(self) -> str:
        port_list = list(self.ports)
        values = {"name": self.name, "pid": self.pid, "ports": port_list}
        return values


def get_processes(log=False) -> Process:
    files = subprocess.run(['lsof', '-i', '-n', '-P'], stdout=subprocess.PIPE)
    output = "{}".format(files.stdout.decode('utf-8'))

    start_port = 3000
    end_port = 10000
    port_range = range(start_port, end_port)


    lines = []
    for line in output.split("\n"):
        chunks = line.split()
        if len(chunks) == 10 and chunks[7] == "TCP":
            process = ProcessPort(name=chunks[0], pid=chunks[1], address=chunks[8])
            if process.port in port_range:
                lines.append(process)

    process_port_map = {}
    process_name_map = {}
    process_ids = set()

    for p in lines:
        process_ids.add(p.pid)
        process_name_map[p.pid] = p.name
        ports = process_port_map[p.pid] if p.pid in process_port_map else set()
        ports.add(p.port)
        process_port_map[p.pid] = ports

    results = []
    for pid in process_ids:
        p = Process(process_name_map[pid], pid, process_port_map[pid])
        results.append(p)
        if log:
            print(p.to_string())
    return sorted(results, key=lambda process: process.name)

app = Flask(__name__)
CORS(app)

headers = {
    "Content-Type": "application/json"
}


@app.route("/")
def getProcessInfo():
    results = get_processes(True)
    dictObjects = []
    for r in results:
        dictObjects.append(r.to_dict())
    response = Response(response=json.dumps(dictObjects), status=HTTPStatus.OK, headers=headers)
    return response

app.run(port=8083)