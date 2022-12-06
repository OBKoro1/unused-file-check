const fs = require('fs')
const chalk = require('chalk')
const path = require('path')

function isFile(url, key) {
    const isFile = fs.existsSync(url)
    if (!isFile) {
        console.log(chalk.red('Error: 配置参数错误, ' + key + '必须是文件', url))
        process.exit(1)
    }
}

function isDirectory(url, key) {
    const isDirectory = fs.statSync(url).isDirectory()
    if (!isDirectory) {
        console.log(chalk.red('Error: 配置参数错误, ' + key + '必须是文件夹', url))
        process.exit(1)
    }
}

function pathAbsolute(url, key, type = 'file') {
    if (!url) {
        console.log(chalk.red('Error: 配置参数错误, ' + key + '未设置'))
        process.exit(1)
    }
    const absoluteUrl = path.resolve(process.cwd(), url)
    if (type === 'file') {
        isFile(absoluteUrl, key)
    } else {
        isDirectory(absoluteUrl, key)
    }
    return absoluteUrl
}

module.exports = {
    isFile,
    isDirectory,
    pathAbsolute
}
