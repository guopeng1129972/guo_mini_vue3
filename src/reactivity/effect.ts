class ReactiveEffect {
  private _fn: any;
  constructor(fn: any) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
}
let activeEffect: any;

const targetMap = new Map();
// 依赖收集 track
export function track(target: any, key: any) {
  // targetMap[key] = target;
  // target -> key -> dep 映射关系
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  // dep 不能重复 用set
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  dep.add(activeEffect);
}
// 触发依赖 trigger
export function trigger(target: any, key: any) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    effect.run();
  }
}
// 依赖收集 就是收集 effect
export function effect(fn: any) {
  const _effect = new ReactiveEffect(fn);
  // 调用 ReactiveEffect.run 就是执行fn方法
  _effect.run();
  //bind 绑定this指向为_effect实例对象
  return _effect.run.bind(_effect);
}
