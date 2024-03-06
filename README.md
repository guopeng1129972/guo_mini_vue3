# guo_mini_vue3

guo_mini_vue3

# 05-setup 环境：集成 jest & ts

```js
yarn init -y

mkdir src
cd src
mkdir reactivity
安装 typescript
yarn add typescript --dev
//初始化 ts
npx tsc --init
初始化 jest
yarn add jest @types/jest --dev

// # jest 配置 babel

https://www.jestjs.cn/docs/getting-started
yarn add --dev babel-jest @babel/core @babel/preset-env

// 支持ts
yarn add --dev @babel/preset-typescript

touch babel.config.js
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
};
```

# 上不上去 github

git config --global --unset http.proxy
git config --global --unset https.proxy

# 06-实现 effect & reactive 依赖收集&触发依赖

实现 get 收集依赖 触发 set 触发依赖

1. 实现 reactive
   reactive (实现对象的 getset，并通过 effect 来收集依赖（track）触发依赖（trigger）)
   通过 Proxy 创建响应式对象 Reflect.get()Reflect.set() 同时执行 track （get）trigger(set)
2. 实现 effect
   创建 ReactiveEffect 类
   get 时执行一遍 effect 的 run 方法 run 方法执行收集依赖进来的 fn
   创建全局变量 activeEffect 绑定到当前 this
   实现 track (get 时) track：收集依赖 记录当前依赖 map（targetMap）targetMap， targetMap：当前依赖的 map , depsMap:记录具体哪个数据的 map，记录对应关系，每一个 dep 记录每一个 key
   实现 trigger (set 时) trigger:触发依赖 根据 targetMap 找到对应的 target 的对应 depMap 关系,依次出发 depMap 的 run 方法，实现动态绑定

# 07-实现 effect 返回 runner

实现 runner: effcet.run 对应的方法（fn）的 return 操作
实现返回 fn 方法的 return 操作 就是返回实例对象的 run 方法 effect.run(),绑定到当前实例对象 effect 的作用域内 run 方法内部也返回当前 fn 方法

# 08-实现 effect 的 scheduler 功能

scheduler 的实现逻辑

1. 通过 effect 的第二个参数给定的 一个 scheduler 的 fn
2. effect 第一次执行的时候还会执行 fn
3. 当响应式对象 set update 不会执行 fn 而是执行 scheduler
4. 如果说当执行 runner 的时候，会再次执行 fn

在 effect 的 ReactiveEffect 类里面新增 scheduler?
在 effect 的 trigger 方法执行时 判断是否存在 scheduler 存在就执行 scheduler 不存在执行 run 方法

# 09-实现 effect 的 stop 功能

实现 stop:终止方法 接收一个 runner（effect 实例方法），

1. 把 effect 实例绑定到 runner 上，然后把 runner return 出去，
2. 在 ReactiveEffect 类上创建当前 activeEffect 的 deps 数组，建立映射关系；同时创建 active 标识，避免重复删除
3. 在 ReactiveEffect 类上声明实例方法 stop，stop 方法中删除当前 activeEffect 的 dep 在对应的 deps 中的 dep
4. 在 track 的时候 用 dep 收集 activeEffect 同步反向在 activeEffect 创建 deps 记录当前的 dep
5. 抽离删除 dep 方法到 clearEffect
6. 创建公共 extend 方法合并 options（Object.assign()）

实现 onStop:stop 执行之后的回调方法

1. 于 scheduler 相似，在 options 中传入 onStop 方法，绑定到\_effect 实例上
2. 在 ReactiveEffect 类上创建当前 onStop 的 方法
3. 当执行 stop 方法的时候 如果存在 onStop 方法 执行 onStop

# 10-实现 readonly 功能

1. 首先 readonly 与 reactive 类似 区别在于 readonly 是不能 set 的
2. 主要做代码优化，抽离逻辑
3. readonly 来源于 reactive.ts ，创建 createActiveObject 优化 baseHandlers readonly ->readonlyHandlers reactive ->mutableHandlers
4. 抽离出来 baseHandlers ，把之前的 createGetter createSetter readonlyGet 提到全局（这样就不用重复声明了），readonlyGet 区分 readonly , export mutableHandlers readonlyHandlers
