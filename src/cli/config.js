const options = {
    check: {
        option: '-c, --check',
        default: false,
        description: '检测文件是否被引用'
    },
    configPath: {
        option: '-p, --configPath <type>',
        description: '必传: 工具配置文件路径',
        require: true
    },
    delete: {
        option: '-d, --delete',
        default: false,
        description: '删除检测出来的已确认需要删除的冗余文件'
    }
}

module.exports = options
