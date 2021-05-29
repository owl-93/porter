import { exec } from 'child_process'

interface PortData {
    name: string,
    pid: string,
    ports: number[]
}

function getPorts(callback: (result?: PortData[], error?: any) => void, startRange=3000, endRange=10000) {
    exec("lsof -i -n -P", (error, stdout: string, stderr: string) => {
        if(error) {
            console.warn(error)
            callback([], error)
        }else if(stderr) {
            console.warn("stderr: ", stderr)
            callback([], stderr)
        }else {
            const result = extractProcesses(stdout, startRange, endRange)
            callback(result)
        }
    })
}

const extractProcesses = (stdout: string, startPort: number, endPort: number): PortData[] => {
    const pids: string[] = []
    const name_map = new Map<string, string>()
    const port_map = new Map<string, number[]>()

    stdout.split('\n').forEach((line: string) => {
        const chunks = line.split(/\s+/)        
        if(chunks.length === 10 && chunks[7] === "TCP"){
            const port = extractPort(chunks[8])
            if(port >= startPort && port < endPort) {
                const pid = chunks[1]
                if(!pids.includes(pid)) 
                    pids.push(pid)
                name_map.set(pid, chunks[0])
                const ports = port_map.get(pid) || []
                if(!ports.includes(port)) 
                    ports.push(port)
                port_map.set(pid, ports)
            }
        }
    })
    const processes: PortData[] = []
    pids.forEach((pid: string) => {
        const ports = port_map.get(pid)
        if(ports && ports.length > 0) {
            processes.push({
                name: name_map.get(pid)!!,
                pid,
                ports
            })
        }
    })
    processes.sort((a: PortData, b: PortData) => strcmp(a.name, b.name))
    return processes
}

const strcmp = (a: string, b: string) =>  a === b ? 0 : a < b ? -1 : 1

const extractPort = (address: string): number => {
    const chunks = address.split(":")
    const port_string = chunks[1]
    return Number(port_string.split("->")[0])
}

export { getPorts }
export type { PortData }