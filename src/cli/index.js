/*
 * Author       : OBKoro1 obkoro1@foxmail.com
 * Date         : 2022-06-08 22:13:10
 * Last Author  : OBKoro1 obkoro1@foxmail.com
 * LastEditTime : 2022-06-30 16:28:17
 * FilePath     : /src/cli/index.js
 * description  : 用户运行命令行入口
 * koroFileheader VSCode插件
 * Copyright (c) 2022 by OBKoro1 email: obkoro1@foxmail.com, All Rights Reserved.
 */

const CommandHandleInstance = require('./CommandHandle')
const Inquirer = require('./Inquirer')
const CheckCommand = require('./CheckCommand')
const UserConfigHandle = require('../UserConfigHandle')
const chalk = require('chalk')

class Cli {
  constructor () {
    this.userConfig = {}
    this.commandOptions = {}
    this.answerOptions = {}
    this.config = {} // 合并的最终配置
    this.run()
  }

  async run () {
    // 运行命令
    await this.configHandle()
    this.runCommand()
  }

  /**
   * @description: 处理所有配置
   */
  async configHandle () {
    // 处理参数
    this.getCommandOptions()
    this.getUserConfig()
    await this.getInquirerAnswer()
    // 合并配置
    this.config = Object.assign(this.answerOptions, this.commandOptions, this.userConfig, this.config)
  }

  runCommand () {
    if (this.config.check) {
      // 运行命令打包检测
      this.checkCommandRun()
    } else if (this.config.delete) {
      // 删除文件 检测
      this.deleteCommandRun()
    } else {
      console.log(
        chalk.red('至少需要使用-c 命令 检测冗余文件 或 -d命令删除文件')
      )
    }
  }

  /**
   * @description: 命令行配置
   */
  getCommandOptions () {
    this.commandOptions = CommandHandleInstance.runCommandInit()
  }

  /**
   * @description: 用户配置文件配置
   */
  getUserConfig () {
    const UserConfigHandleInstance = new UserConfigHandle()
    this.userConfig = UserConfigHandleInstance.run(this.commandOptions)
  }

  /**
   * @description: 交互式命令配置
   */
  async getInquirerAnswer () {
    const InquirerInstance = new Inquirer(this.commandOptions, this.userConfig)
    // 交互式命令行答案
    this.answerOptions = await InquirerInstance.getPromiseInquirer()
  }

  /**
   * @description:
   * @return {type}
   */
  checkCommandRun () {
    CheckCommand.run(this.config)
  }

  deleteCommandRun () {
    // deleteCommandRun.run(this.config)
  }
}

module.exports = new Cli()
