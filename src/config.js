/**
 * ngi config [nginx config file path]
 * @param path
 * @example D:\user\nginx-1.18.0\conf\nginx.conf
 */
const fs = require('fs')
const path = require('path')
const config = require('../config')
module.exports = function (fileUrl) {
    if (!fileUrl.length) return console.log('error: no path!')
    // 判断文件是否存在
    try {
        fs.statSync(fileUrl[0])
    } catch (e) {
        return console.log(e)
    }
    // 保存nginx基础配置文件的路径
    try {
        fs.writeFileSync(path.join(__dirname, 'config.txt'), JSON.stringify({
            configFile: fileUrl[0]
        }))
    } catch (e) {
        return console.log(e)
    }
    // 向nginx基础配置文件中写入 include ngi/*.conf;
    try {
        const doc = fs.readFileSync(fileUrl[0])
        // /^[http\s{]}$/
        const text = doc.toString()

        if (text.includes(config.nginxIncludes)) {
            return console.log('success: config complete!')
        }

        let i = text.indexOf('http {')

        const s_text = text.slice(0, i)
        const e_text = text.slice(i)

        let n = e_text.indexOf('server {')
        const e_s_text = e_text.slice(0, n)
        const e_e_text = e_text.slice(n)

        const addText = config.nginxIncludes + '\n\n\t'

        const content = s_text + e_s_text + addText + e_e_text

        try {
            fs.writeFileSync(fileUrl[0], content)
            return console.log('success: config complete!')
        } catch (e) {
            return console.log(e)
        }
    } catch (e) {
        return console.log(e)
    }
}
