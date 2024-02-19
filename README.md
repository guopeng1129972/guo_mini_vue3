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
