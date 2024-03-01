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
