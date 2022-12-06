import { removeScope, getDependencieNames, toStringTag } from 'package-tls'
// 压缩
import { terser } from 'rollup-plugin-terser'
// 输出文件夹清除
import del from 'rollup-plugin-delete'
import pkg from './package.json'
import { dirname } from 'path'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import 'regenerator-runtime/runtime'

// 输入（入口）文件
const input = {
  main: 'src/index.js',
  cli: 'src/cli/index.js'
}
const outputDir = dirname(pkg.main || 'dist/*') // 输出目录
const extensions = ['.js', '.json', '.node'] // 默认查找的文件扩展名
// 要插入到生成文件顶部的字段串；
const banner = toStringTag(2)`
/*
${pkg.name}-${pkg.version && 'v' + pkg.version}
author: ${pkg.author}
license: ${pkg.license}
homepage: ${pkg.homepage}
repository: ${pkg.repository}
description: ${pkg.description}
*/
`

// rollup 中共用的 output 选项
const shareOutput = {
  // 要插入到生成文件顶部的字段串；
  banner,
  // 要插入到生成文件底部的字段串；
  footer: banner,
  acorn: {
    allowHashBang: true
  },
  // 输出文件的存放目录；只用于会生成多个 chunks 的时候
  dir: './',
  // 生成 chunks 名字的格式
  entryFileNames: `${outputDir}/${removeScope(pkg.name)}-[name].[format].js`
}

const nodeResolve = {
  // browser   类型: Boolean   默认值: false
  // 是否优先使用 `package.json` 中的 browser 字段来解析依赖包的入口文件；
  // - 构建专门用于浏览器环境的包时，建义设置为 `browser:true`；
  // - 构建专门用于node环境的包时，建义设置为 `browser:false` 或者 删除此选项；
  // extensions   类型: Array[...String]    默认值: ['.mjs', '.js', '.json', '.node']
  // 扩展文件名
  // browser:true,
  extensions
}

// 共用的 rollup 配置
const shareConf = {
  input,
  external: getDependencieNames(pkg), // 移除 package.json 中所有的依赖包
  plugins: [
    // 使用node解析算法查找模块
    resolve(nodeResolve),
    commonjs(),
    getBabelOutputPlugin({
      allowAllFormats: true,
      exclude: 'node_modules/**',
      presets: ['@babel/env'],
      plugins: [[
        '@babel/plugin-transform-runtime',
        {
          regenerator: true
        }
      ]]
    }),
    json(), // 将 json 文件转为 ES6 模块
    replace({
      ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'development')
    })
    // 代码压缩
    // terser()
  ]
}

// 导出的 rollup 配置
export default [
  /*
    适合模块的构建
    特点：
        - 以 js模块 的方式被引入
        - 移除了 node_modules 中的所有依赖
    */
  {
    ...shareConf, // disable-eslint-line
    output: [
      {
        ...shareOutput,
        plugin: [
          del({
            targets: ['dist']
          })
        ],
        format: 'es'
      }, // ES module
      { ...shareOutput, format: 'cjs' }, // CommonJS
      { ...shareOutput, format: 'amd' } // amd
      /*
        umd：兼容各种引入方式
        可以以 AMD 或 CommonJS 模块的方式引入，也可以用 <script> 标签直接引入;
        由于包中删除了依赖，所以若以 <script> 标签的方式引入，则需要用 <script> 标签的方式先将其依赖引入
        */
    ]
  }
]
