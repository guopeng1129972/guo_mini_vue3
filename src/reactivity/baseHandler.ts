import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

const get = createGetter();
const readonlyGet = createGetter(true);
const set = createSetter();

//  抽离get
function createGetter(isReadonly: any = false) {
  return function get(target: any, key: any) {
    console.log(key, "createGetter key");
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}
//  抽离set
function createSetter(isReadonly: any = false) {
  return function set(target: any, key: any, value: any) {
    const res = Reflect.set(target, key, value);
    if (!isReadonly) {
      trigger(target, key);
    }
    return res;
  };
}

export const mutableHandlers = {
  get,
  set,
};
export const readonlyHandlers = {
  get: readonlyGet,
  set(target: any, key: any, value: any) {
    console.warn(`key:${key} set 失败 因为 target:${target} is readonly!`);
    return true;
  },
};
