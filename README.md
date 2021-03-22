# taro-tailwind
taro-tailwind是一个为了在[Taro](https://github.com/NervJS/taro)中使用[TailwindCSS](https://tailwindcss.com/)而编写的工具。该工具生成适合在Taro中使用的TailwindCSS类，去掉了响应式布局、伪类等特性。taro-taiwind同时保留了通过tailwind.config.js配置文件调整样式的能力。项目基于[nativescript-tailwind](https://github.com/rigor789/nativescript-tailwind)修改而来。

ps:
taro-tailwind理论上可以直接使用在小程序项目里。

## 安装
npm:
```shell
npm install --save-dev taro-tailwind
```
yarn:
```shell
yarn add --dev taro-tailwind
```

## 使用
支持2种使用方式:
1. 直接引入预先生成的css文件；
2. 使用PostCSS生成自定义的css文件(通过tailwind.config.js)。

### 1. 直接引入
 在app.jsx中引入样式文件
```js
import 'taro-tailwind/dist/tailwind.css'
```
### 2. 使用PostCSS生成
添加talwindcss依赖:
```shell
# 使用npm
npm install --save-dev tailwindcss postcss postcss-cli

# 使用yarn
yarn add --dev tailwindcss postcss postcss-cli
```

复制默认配置tailwind.config.js和基础类定义tailwind.src.css到项目目录:
```shell
cp ./node_modules/taro-tailwind/tailwind.config.js ./tailwind.config.js
cp ./node_modules/taro-tailwind/tailwind.src.css ./src/tailwind.src.css
```

在postcss.config.js中添加:
```js
module.exports = {
  plugins: [
    // ...
    require('tailwindcss'),
    require('taro-tailwind'),
    // ...
  ]
}
```
然后使用postcss执行生成css文件:
```shell
npx postcss ./src/tailwind.src.css -o ./src/tailwind.css
```
 在app.jsx中引入样式文件
```js
import './tailwind.css'
```


## 注意事项

### 在自定义组件中使用时，建议设置options.addGlobalClass字段为true，以免生成的样式文件(wxss)太大

```jsx
/* CustomComponent.js */
export default class CustomComponent extends Component {
  static options = {
    addGlobalClass: true
  }

  render () {
    //...
  }
}
```

### 反斜杠、点号和冒号的使用
小程序不支持使用斜杠和点号作为类名，因此默认配置文件(tailwind.config.js)中，斜杠修改成使用下划线`_`，点号改成`d`，例如:
```jsx
<View className='w-1/3'></View>
<View className='w-1.5'></View>
```
应该写成:
```jsx
<View className='w-1_3'></View>
<View className='w-1d5'></View>
```
默认配置中, 冒号定义也已全部去掉。

## FAQ
### 使用PurgeCSS简化生成的tailwind.css
在tailwindcss.config.js增加了purge配置项：
```shell
module.exports = {
  purge: [
    "./src/**/*.js",
    "./src/**/*.html",
    "./src/**/*.vue",
    "./src/**/*.jsx",
    "./src/**/*.tsx",
  ],
  corePlugins: {},
  variants: {},
  theme: {},
};
```

运行命令生成简化后的css（先安装cross-env）：
```bash
cross_env NODE_ENV=production npx postcss ./src/tailwind.src.css -o ./src/tailwind.css
```

`tailwindcss`默认只在production环境运行purgecss，更多purgecss的选项请参考`tailwindcss`的文档。

或加到打包脚本(package.json)里：
```json
{
  "scripts": {
    "build:weapp": "cross-env NODE_ENV=production postcss ./src/tailwind.src.css -o ./src/tailwind.css && taro build --type weapp"
  }
}
```
