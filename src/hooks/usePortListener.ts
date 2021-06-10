import { useEffect, useState } from "react";
import { PortData, IpcApi, IpcPortResponse } from "../model/model";

export const usePortListener = (ipcApi?: IpcApi, debug = false): IpcPortResponse => {
    const [data, setData] = useState<PortData[] | undefined>()
    const [error, setError] = useState<any>()

    useEffect(() => {
        const listener = (response: IpcPortResponse) => {
            if(response.data){
                debug && console.log("recieved port data", response.data)
                setData(response.data)
            } else if(response.error) {
                debug && console.log("recieved error on port data", response.error)
                setError(response.error)
            }
        }
        if(ipcApi) {
            debug && console.log("setting up IPC receiver")
            ipcApi.subscribe("ports", listener)
        }
        return () => {
            ipcApi?.unsubscribe("ports", listener)
            debug && console.log("unsubscribing listener")
        }
    }, [ipcApi, debug])

    return { data, error}
}