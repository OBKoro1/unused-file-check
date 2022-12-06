/*
 * Author       : OBKoro1 obkoro1@foxmail.com
 * Date         : 2022-06-09 22:32:17
 * Last Author  : OBKoro1 obkoro1@foxmail.com
 * LastEditTime : 2022-06-30 14:39:26
 * FilePath     : /src/cli/CommandHandle.js
 * description  : 命令行处理
 * koroFileheader VSCode插件
 * Copyright (c) 2022 by OBKoro1 email: obkoro1@foxmail.com, All Rights Reserved.
 */

const { program } = require('commander')
const config = require('./config')
const chalk = require('chalk')

class CommandHandle {
  constructor () {
    this.commandOptions = {} // 最终配置
  }

  runCommandInit () {
    this.handleDefault()
    this.mergeOptions()
    this.checkCommand()
    return this.commandOptions
  }

  /**
   * @description: 注册命令
   */
  handleDefault () {
    for (const key in config) {
      const item = config[key]
      if (item.require) {
        program.requiredOption(item.option, item.description)
      } else {
        program.option(item.option, item.description, item.default)
      }
    }
  }

  /**
   * @description: 解析命令 获取参数
   * @return {type}
   */
  mergeOptions () {
    program.version(process.env.npm_config_init_version)
    program.parse(process.argv)
    const userArgs = program.opts()
    this.commandOptions = userArgs
  }

  checkCommand () {
    if (this.commandOptions.check && this.commandOptions.delete) {
      console.log(chalk.red('check和delete命令不能同时使用'))
      process.exit(1)
    }
    if (!this.commandOptions.check && !this.commandOptions.delete) {
      console.log(chalk.red('至少需要使用-c 命令 检测冗余文件 或 -d命令删除文件'))
      process.exit(1)
    }
  }
}

module.exports = new CommandHandle()
