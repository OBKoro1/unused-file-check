
const fs = require('fs')
const path = require('path')
const shelljs = require('shelljs')

class CleanUnusedFilesPlugin {
  constructor (options) {
    this.opts = options
  }

  apply (compiler) {
    const _this = this
    compiler.plugin('after-emit', function (compilation, done) {
      _this.findUnusedFiles(compilation, _this.opts)
      done()
    })
  }

  /**
 * 获取依赖的文件
 */
  getDependFiles (compilation) {
    return new Promise((resolve, reject) => {
      const dependedFiles = [...compilation.fileDependencies].reduce(
        (acc, usedFilepath) => {
          if (!~usedFilepath.indexOf('node_modules')) {
            acc.push(usedFilepath)
          }
          return acc
        },
        []
      )
      resolve(dependedFiles)
    })
  }

  /**
 * 获取项目目录所有的文件
 */
  getAllFiles (pattern, root) {
    return new Promise((resolve, reject) => {
      function readFileList (dir, filesList = []) {
        const files = fs.readdirSync(dir)
        files.forEach((item, index) => {
          const fullPath = path.join(dir, item)
          const stat = fs.statSync(fullPath)
          if (stat.isDirectory()) {
            readFileList(path.join(dir, item), filesList) // 递归读取文件
          } else {
            filesList.push(fullPath)
          }
        })
        return filesList
      }
      const filesList = readFileList(root, [])
      resolve(filesList)
    })

    // return new Promise((resolve, reject) => {
    //   glob(pattern, {
    //     nodir: true
    //   }, (err, files) => {
    //     if (err) {
    //       throw err
    //     }
    //     const out = files.map(item => path.resolve(item))
    //     resolve(out)
    //   })
    // })
  }

  dealExclude (path, unusedList) {
    const file = fs.readFileSync(path, 'utf-8')
    const files = JSON.parse(file) || []
    const result = unusedList.filter(unused => {
      return !files.some(item => ~unused.indexOf(item))
    })
    return result
  }

  async findUnusedFiles (compilation, config = {}) {
    const { root = './src', clean = false, output = './unused-files.json', exclude = false, outputAllFiles, outputAllChunks } = config
    const pattern = root + '/**/*'
    // eslint-disable-next-line no-useless-catch
    try {
      const allChunks = await this.getDependFiles(compilation)
      const allFiles = await this.getAllFiles(pattern, root)
      let unUsed = allFiles
        .filter(item => !allChunks.includes(item))
      if (exclude && typeof exclude === 'string') {
        unUsed = this.dealExclude(exclude, unUsed)
      }
      if (outputAllChunks) fs.writeFileSync(outputAllChunks, JSON.stringify(allChunks, null, 4))
      if (outputAllFiles) fs.writeFileSync(outputAllFiles, JSON.stringify(allFiles, null, 4))
      if (typeof output === 'string') {
        fs.writeFileSync(output, JSON.stringify(unUsed, null, 4))
      } else if (typeof output === 'function') {
        output(unUsed)
      }
      if (clean) {
        unUsed.forEach(file => {
          shelljs.rm(file)
          console.log(`remove file: ${file}`)
        })
      }
      return unUsed
    } catch (err) {
      throw (err)
    }
  }
}

module.exports = CleanUnusedFilesPlugin
