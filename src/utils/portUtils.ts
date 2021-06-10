import { PortData } from "../model/model";

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
  
export const portDataShallowCompare = (update?: PortData[], current?: PortData[]): boolean => {
    if (!update || !current || update.length !== current.length) return false;
    update.forEach((element: PortData, idx: number) => {
      if (!portDataEquals(element, current[idx])) return false;
    });
    current.forEach((element: PortData, idx: number) => {
      if (!portDataEquals(element, update[idx])) return false;
    });
    return true;
  };
  
