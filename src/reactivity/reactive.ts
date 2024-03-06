import { mutableHandlers, readonlyHandlers } from "./baseHandler";

export function reactive(raw: any) {
  return createActiveObject(raw, mutableHandlers);
}

// readonly reactive的只读模式 就是说没有set
export const readonly = (raw: any) => {
  return createActiveObject(raw, readonlyHandlers);
};

function createActiveObject(raw: any, baseHandlers: any) {
  return new Proxy(raw, baseHandlers);
}
