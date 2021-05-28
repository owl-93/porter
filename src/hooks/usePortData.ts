import { useState, useEffect, useCallback } from "react";
import { PortData } from "../model/model";
import { IpcApi } from "../App";

interface PortDataResult {
  result: PortData[] | undefined;
  error: any | undefined;
  loading: boolean;
}

let fetchInterval: any;

export const usePortData = (ipcApi?: IpcApi, interval = 3000, mock = false): PortDataResult => {
  const [result, setResult] = useState<PortData[]>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [ipcPortResult, setIpcPortResult] = useState<PortData[]>([]);

  const handleError = useCallback((e: any) => {
    setLoading(false);
    setError(e);
    console.warn(e);
  }, []);

  //meomoized ipc fetcher
  const getPorts = useCallback(() => {
    setLoading(true);
    ipcApi?.send("ports");
  }, [ipcApi]);

  //set up interval for ipc calls
  useEffect(() => {
    if (ipcApi) {
      fetchInterval = setInterval(getPorts, interval);
    }
    return () => clearInterval(fetchInterval);
  }, [interval, ipcApi, getPorts]);

  //register ipc receiver for replies
  useEffect(() => {
    ipcApi?.receive("ports-reply", (response: { data: PortData[]; error: any }) => {
        //console.log(`received port response:`, response);
        setLoading(false);
        const { data, error } = response;
        data && setIpcPortResult(data);
        error && handleError(error);
      }
    );
  }, [ipcApi, handleError]);

  //initial fetch
  useEffect(() => ipcApi && getPorts(), [ipcApi, getPorts]);

  //monitor the result of ipc fetches and determine if we should update result
  useEffect(() => {
    if (!shallowEquals(ipcPortResult, result)) {
      setResult(ipcPortResult);
    }
  }, [ipcPortResult, result]);

  return { result, error, loading };
};

const portDataEquals = (p1?: PortData, p2?: PortData): boolean => {
  if (!p1 || !p2) return false;
  if (p1.pid !== p2.pid || p1.name !== p2.name) return false;
  p1.ports.forEach((p) => {
    if (!p2.ports.includes(p)) return false;
  });
  p2.ports.forEach((p) => {
    if (!p1.ports.includes(p)) return false;
  });
  return true;
};

const shallowEquals = (update?: PortData[], current?: PortData[]): boolean => {
  if (!update || !current || update.length !== current.length) return false;
  update.forEach((element: PortData, idx: number) => {
    if (!portDataEquals(element, current[idx])) return false;
  });
  current.forEach((element: PortData, idx: number) => {
    if (!portDataEquals(element, update[idx])) return false;
  });
  return true;
};
