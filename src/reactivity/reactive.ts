import { mutableHandlers, readonlyHandlers } from "./baseHandler";

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

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

export const isReactive = (value: any) => {
  return !!value[ReactiveFlags.IS_REACTIVE];
};
export const isReadonly = (value: any) => {
  return !!value[ReactiveFlags.IS_READONLY];
};
