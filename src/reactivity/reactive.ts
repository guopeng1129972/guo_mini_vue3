import { track, trigger } from "./effect";

export function reactive(raw: any) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);
      // todo 依赖收集 track
      track(target, key);
      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);
      // todo 触发依赖 trigger
      trigger(target, key);
      return res;
    },
  });
}
