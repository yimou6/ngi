#! node

const config = require('./config')

console.log('--- start ---')

if (process.argv.length < 3) return

if (config.ARGV.includes(process.argv[2])) {
    let param = process.argv
    const funcName = param[2]
    param.splice(0, 3)
    require('./src/' + funcName)(param)
}
