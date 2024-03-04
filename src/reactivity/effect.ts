import { extend } from "../shared";
class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  onStop?: () => void;
  // 声明  scheduler 是 public的 可以不传的
  constructor(fn: any, public scheduler?: any) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
  stop() {
    if (this.active) {
      clearEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
// 清除deps里的stop的effect
function clearEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
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
  if (!activeEffect) return;
  // 用dep收集activeEffect
  dep.add(activeEffect);
  // activeEffect创建deps记录当前的dep
  activeEffect.deps.push(dep);
}
// 触发依赖 trigger
export function trigger(target: any, key: any) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    // 如果存在scheduler 执行 scheduler 不然执行 run
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
//  stop
export function stop(runner: any) {
  runner.effect.stop();
}

// 依赖收集 就是收集 effect
export function effect(fn: any, options: any = {}) {
  // fn
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // 1.options 优化点：通过Object.assign(_effect, options); 优化把options上的属性挂载到_effect， _effect.onStop = options.onStop;
  // Object.assign(_effect, options);
  // 2.extend 优化成extend的写法
  extend(_effect, options);
  // 调用 ReactiveEffect.run 就是执行fn方法
  _effect.run();
  //bind 绑定this指向为_effect实例对象
  const runner: any = _effect.run.bind(_effect);
  // 把当前_effect 绑定到runner上 补充:将extend的方法写上去
  runner.effect = _effect;
  return runner;
}
