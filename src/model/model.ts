export interface PortData {
    name: string,
    pid: string,
    ports: number[]
}

export interface IpcPortResponse {
    data: PortData[] | undefined,
    error: any
}

export interface IpcApi {
    send: (destination: string) => void
    subscribe: (channel: string, callback: (response: IpcPortResponse) => void) => void
    unsubscribe: (channel: string, callback: (response: IpcPortResponse) => void) => void
}

