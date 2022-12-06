/*
 * Author       : OBKoro1 obkoro1@foxmail.com
 * Date         : 2022-06-09 23:57:42
 * Last Author  : OBKoro1 obkoro1@foxmail.com
 * LastEditTime : 2022-06-30 15:52:09
 * FilePath     : /src/cli/Inquirer.js
 * description  : 创建交互式命令行
 * koroFileheader VSCode插件
 * Copyright (c) 2022 by OBKoro1 email: obkoro1@foxmail.com, All Rights Reserved.
 */

const inquirer = require('inquirer')
const chalk = require('chalk')

class CreateInquirer {
    constructor(commandOptions, userConfig) {
        this.commandOptions = commandOptions
        this.userConfig = userConfig
        this.inquirer = inquirer
        this.promiseInquirer = this.create()
        this.catch()
    }

    // 创建问答
    create() {
        const questions = this.chooseQuestion()
        return this.inquirer.prompt(questions)
    }

    // 问答结果
    getPromiseInquirer() {
        return new Promise((resolve, reject) => {
            this.promiseInquirer
                .then((answers) => {
                    resolve(answers)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    chooseQuestion() {
        if (this.commandOptions.check) {
            return this.questionsCreateCheck()
        } else if (this.commandOptions.delete) {
            return this.questionsCreateDelete()
        }
    }

    // 运行命令行check时
    questionsCreateCheck() {
        const questionsArr = []
        return questionsArr
    }

    questionsCreateDelete() {
        return [
            {
                type: 'confirm',
                name: 'deleteConfirm',
                message: '检查冗余文件清单完毕, 确认删除所有冗余文件?'
            }
        ]
    }

    // 错误捕获
    catch() {
        this.promiseInquirer.catch((error) => {
            if (error.isTtyError) {
                console.log(chalk.red(`isTtyError error: ${error}`))
            } else {
                console.log('inquirer Error', error)
            }
        })
    }
}

module.exports = CreateInquirer
