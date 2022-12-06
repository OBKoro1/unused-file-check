const CleanUnusedFilesPlugin = require('./check-webpack-build')
const UserConfigHandle = require('./UserConfigHandle')

class WebpackPluginEnter {
    constructor(options) {
        this.compiler = {} // webpack compiler
        this.userConfig = {}
        this.commandOptions = {}
        this.getEnv()
    }

    getEnv() {
        console.log('process', process.env)
        const index = process.env.UNUSED_FILE_Run_COMMAND_INDEX
        if (index) {
            this.check = true
            this.commandOptions = {
                configPath: this.options.configPath,
                check: true,
                index
            }
            const UserConfigHandleInstance = new UserConfigHandle()
            this.userConfig = UserConfigHandleInstance.run(this.commandOptions)
        }
    }

    apply(compiler) {
        this.compiler = compiler
        this.watchEmit()
    }

    /**
     * @description: 监听webpack 事件
     * 打log提醒或者检测冗余文件
     */
    watchEmit() {
        this.compiler.plugin('after-emit', async (compilation, done) => {
            if (this.commandOptions.check) {
                const CleanUnusedFilesPluginInstance = new CleanUnusedFilesPlugin(this.userConfig, this.commandOptions)
                await CleanUnusedFilesPluginInstance.apply(compilation)
            } else {
                // 检测冗余文件 是否超过一定时间没有跑
                console.log('没有环境变量, 不检测冗余文件')
            }
            done()
        })
    }
}

module.exports = WebpackPluginEnter
