"use strict";
exports.__esModule = true;
exports.getPorts = void 0;
var child_process_1 = require("child_process");
function getPorts(callback, startRange, endRange) {
    if (startRange === void 0) { startRange = 3000; }
    if (endRange === void 0) { endRange = 10000; }
    child_process_1.exec("lsof -i -n -P", function (error, stdout, stderr) {
        if (error) {
            console.warn(error);
            callback([], error);
        }
        else if (stderr) {
            console.warn("stderr: ", stderr);
            callback([], stderr);
        }
        else {
            var result = extractProcesses(stdout, startRange, endRange);
            callback(result);
        }
    });
}
exports.getPorts = getPorts;
var extractProcesses = function (stdout, startPort, endPort) {
    var pids = [];
    var name_map = new Map();
    var port_map = new Map();
    stdout.split('\n').forEach(function (line) {
        var chunks = line.split(/\s+/);
        if (chunks.length === 10 && chunks[7] === "TCP") {
            var port = extractPort(chunks[8]);
            if (port >= startPort && port < endPort) {
                var pid = chunks[1];
                if (!pids.includes(pid))
                    pids.push(pid);
                name_map.set(pid, chunks[0]);
                var ports = port_map.get(pid) || [];
                if (!ports.includes(port))
                    ports.push(port);
                port_map.set(pid, ports);
            }
        }
    });
    var processes = [];
    pids.forEach(function (pid) {
        var ports = port_map.get(pid);
        if (ports && ports.length > 0) {
            processes.push({
                name: name_map.get(pid),
                pid: pid,
                ports: ports
            });
        }
    });
    processes.sort(function (a, b) { return strcmp(a.name, b.name); });
    return processes;
};
var strcmp = function (a, b) { return a === b ? 0 : a < b ? -1 : 1; };
var extractPort = function (address) {
    var chunks = address.split(":");
    var port_string = chunks[1];
    return Number(port_string.split("->")[0]);
};
