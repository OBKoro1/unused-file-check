const shelljs = require('shelljs')
const chalk = require('chalk')
const { checkUnusedFileTypeOptions } = require('../types')

class CheckCommand {
    async run(config) {
        this.config = config
        this.buildCommandArr = []
        await this.runCommandArr()
    }

    runCommandArr() {
        for (const [index, item] of this.checkOptionArr.entries()) {
            const { envCommand, command, checkUnusedFileType } = item
            console.log(`总共项目数: ${this.checkOptionArr.length}, 运行第${index + 1}一个项目`)
            if (
                checkUnusedFileType === checkUnusedFileTypeOptions.all ||
                checkUnusedFileType === checkUnusedFileTypeOptions.webpack
            ) {
                console.log(`执行webpack打包命令: ${command}`)
                this.runBuild(envCommand)
            }
            if (
                checkUnusedFileType === checkUnusedFileTypeOptions.all ||
                checkUnusedFileType === checkUnusedFileTypeOptions.ast
            ) {
                console.log(`ast解析检测冗余文件: ${command}`)
                this.runAstCheck(item)
            }
        }
        // TODO: 输出到缓存文件
        // TODO: 合并结果、记录运行时间
    }

    runAstCheck(item) {
        console.log('ast解析检测冗余文件')
    }

    runBuild(command) {
        const res = shelljs.exec(command, {
            encoding: 'utf8',
            cwd: this.config.itemPackagePath // 在vscode打开的项目中使用
        })
        if (res.code !== 0) {
            console.log(chalk.red('Error 命令执行失败: ', command))
            shelljs.exit(1)
        }
        console.log(chalk.green('success 命令执行成功: ', command))
    }
}

module.exports = new CheckCommand()
