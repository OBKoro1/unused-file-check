/*
 * Author       : OBKoro1 obkoro1@foxmail.com
 * Date         : 2022-06-29 17:09:05
 * Last Author  : OBKoro1 obkoro1@foxmail.com
 * LastEditTime : 2022-07-01 11:20:11
 * FilePath     : /src/UserConfigHandle.js
 * description  : 获取用户配置文件，并对其处理和检测
 * koroFileheader VSCode插件
 * Copyright (c) 2022 by OBKoro1 email: obkoro1@foxmail.com, All Rights Reserved.
 */

const chalk = require('chalk')
const { checkUnusedFileTypeOptions } = require('./types')
const { pathAbsolute } = require('./utils')

class UserConfigHandle {
  constructor () {
    this.commandOptions = {}
    this.userConfig = {}
  }

  /**
   * @description: 通过命令行形式进入以及通过webpack插件的env获取配置
   * @param {object} commandOptions 命令行配置 | webpack插件的env配置手动输入
   * @return {object} 全局config 配置
   */
  run (commandOptions) {
    this.commandOptions = commandOptions
    this.userConfig = this.requireConfig(this.commandOptions.configPath)
    this.handleConfig()
    return this.userConfig
  }

  /**
   * @description: 读取配置文件
   */
  requireConfig (configPath) {
    const configAbsolutePath = this.checkConfigPath(configPath)
    let userConfig = {}
    try {
      let config = require(configAbsolutePath)
      // 可以包在unusedConfig里，这样可以放在其他配置文件中, 不用多创建一个文件
      if (config.unusedConfig) {
        config = config.unusedConfig
      }
      userConfig = this.checkConfigOptions(config)
      userConfig.configAbsolutePath = configAbsolutePath
    } catch (err) {
      console.log(chalk.red(`配置文件读取出错, 需要为.js文件以及es5模块(module.exports): ${configAbsolutePath}`))
      console.log(chalk.red(err))
      process.exit(1)
    }
    return userConfig
  }

  /**
   * @description: 简单的检测配置文件是否正确
   */
  checkConfigOptions (config) {
    if (!config.checkFileItemPath) {
      console.log(chalk.red('配置出错: 配置文件中没有checkFileItemPath'))
      process.exit(1)
    }
    if (!config.oftenRun) {
      console.log(chalk.red('配置出错: 配置文件中没有oftenRun'))
      process.exit(1)
    }
    return config
  }

  handleConfig () {
    if (this.commandOptions.check) {
      this.checkConfigHandle()
    } else if (this.commandOptions.delete) {
      this.deleteConfigHandle()
    }
  }

  /**
   * @description: check命令处理配置
   */
  checkConfigHandle () {
    if (this.userConfig.checkFileItemPath) {
      this.userConfig.checkFileItemPath = pathAbsolute(this.userConfig.checkFileItemPath, 'checkFileItemPath', 'Directory')
    }
    if (this.userConfig.outputDirectoryPath) {
      this.userConfig.outputDirectoryPath = pathAbsolute(this.userConfig.outputDirectoryPath, 'outputDirectoryPath', 'Directory')
    }
    this.checkOptionsArrHandle()
  }

  /**
   * @description: delete命令处理配置
   */
  deleteConfigHandle () {
    this.userConfig.sureDeleteFilePath = pathAbsolute(this.userConfig.sureDeleteFilePath, 'sureDeleteFilePath')
  }

  /**
   * @description: 每个打包命令, 检测配置map:
   */
  checkOptionsArrHandle () {
    this.userConfig.checkOptionArr = this.userConfig.checkOptionArr.map((item, index) => {
      const newItem = this.itemHandle(item, index)
      this.checkOptionsArrItem(newItem)
      return {
        ...newItem
      }
    })
  }

  itemHandle (item, index) {
    if (!checkUnusedFileTypeOptions[item.checkUnusedFileType]) item.checkUnusedFileType = checkUnusedFileTypeOptions.all
    item.envCommand = `cross-env UNUSED_FILE_Run_COMMAND_INDEX=${index}`
    const newItem = this.itemPathAction(item)
    return newItem
  }

  /**
   * @description: 检测配置map
   */
  checkOptionsArrItem (item) {
    const checkUnusedFileType = item.checkUnusedFileType
    if (checkUnusedFileType === checkUnusedFileTypeOptions.webpack || checkUnusedFileType === checkUnusedFileTypeOptions.all) {
      if (!item.command) {
        console.log(chalk.red(`配置出错: 当checkUnusedFileType是${checkUnusedFileType}时,检测配置checkOptionArr中没有command`))
        process.exit(1)
      }
    }
    if (checkUnusedFileType === checkUnusedFileTypeOptions.ast || checkUnusedFileType === checkUnusedFileTypeOptions.all) {
      if (!item.astEntryFile) {
        console.log(chalk.red(`配置出错: 当checkUnusedFileType是${checkUnusedFileType}时,检测配置checkOptionArr中没有astEntryFile`))
        process.exit(1)
      }
    }
  }

  itemPathAction (item) {
    this.isHasPathGetPath(item, 'outputDirectoryPath')
    this.isHasPathGetPath(item, 'checkFileItemPath')

    // ast入口绝对地址
    if (item.checkUnusedFileType !== checkUnusedFileTypeOptions.webpack) {
      item.astEntryAbsolutePath = pathAbsolute(item.astEntryFile, 'astEntryFile')
    }
    return item
  }

  /**
   * @description: 获取item或者userConfig的path 如果都没有, 则报错
   */
  isHasPathGetPath (item, key) {
    if (item[key]) {
      // 有item用item
      item[key] = pathAbsolute(item[key], key, 'Directory')
    } else {
      if (this.userConfig[key]) {
        // 如果有 就赋值
        item[key] = this.userConfig[key]
      } else {
        console.log(chalk.red(`配置出错: 外层没有${key}时,检测配置checkOptionArr中没有${key}`))
        process.exit(1)
      }
    }
  }

  /**
   * @description: 检查配置文件路径
   */
  checkConfigPath (configPath) {
    if (!configPath) {
      console.log(
        chalk.red('请输入配置文件路径, 比如: unused-file --check -p ./config/unused-file-check-config.js')
      )
      process.exit(1)
    }
    const configAbsolutePath = pathAbsolute(configPath, 'configPath')
    console.log(chalk(`读取配置文件: ${configAbsolutePath}`))
    return configAbsolutePath
  }
}

module.exports = UserConfigHandle
