// ngi --set [server_name] [location] [proxy_pass] 设置一个配置项

const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')

module.exports = function (params) {
    console.log('params', params)
    inquirer.prompt([
        // server_name
        {
            type: 'input',
            name: 'server_name',
            message: 'server_name',
            default: 'localhost'
        },
        // port
        {
            type: 'input',
            name: 'port',
            message: 'port',
            default: 12345,
            validate: function (input) {
                let done = this.async()
                setTimeout(function () {
                    if (Number(input) < 3000 || Number(input) > 20000) {
                        done('port > 3000 or port < 20000')
                        return
                    }
                    done(null, true)
                }, 100)
            }
        },
        // location
        // validate ???
        {
            type: 'input',
            name: 'location',
            message: 'location'
        },
        {
            type: 'input',
            name: 'proxy_pass',
            message: 'proxy_pass'
        }
    ]).then(answer => {
        console.log('answer', answer)
        // 读取配置文件
        // 查找
        // 已有port -> 判断location -> 新增/修改
        // 没有port -> 新增
        let configPath = ''
        try {
            const _configPath = fs.readFileSync(path.join(__dirname, 'config.txt'))
            configPath = _configPath.toString()
        } catch (e) {
            console.log(e)
        }
        if (!configPath) return console.log('no config')

        let doc = ''
        try {
            const _doc = fs.readFileSync(configPath)
            doc = _doc.toString()
        } catch (e) {
            console.log(e)
        }
        const portIndex = searchServerPort(doc, answer.port)
        // console.log('portIndex', portIndex)
        if (portIndex) {

        } else {
            const template = serverTemplate(answer)
            console.log(template)
            let last = searchLastServer(doc)
            let ser = doc.slice(last)
            console.log(searchServerLength(ser))
            console.log(doc.slice(last, last + 445))
        }
    })
}

function searchServerPort(str, port) {
    let text = str

    let index = text.indexOf('server {')
    if (index === -1) {
        console.log('-------------')
        return ''
    }

    let searchText = text.slice(index)
    let num = searchText.indexOf('listen')
    let numText = searchText.slice(num)
    let portIndex = numText.search(/[0-9]/g)
    let portStopIndex = numText.indexOf(';')
    let _port = numText.slice(portIndex, portStopIndex)
    if (port === _port) {
        return index
    } else {
        return searchServerPort(numText, port)
    }
}

function locationTemplate(location, proxy_pass) {
    return `location ${location} {
        proxy_pass ${proxy_pass};
    }`
}

function serverTemplate(content) {
    const { listen, server_name, location, proxy_pass } = content
    return `server {
        listen      ${listen};
        server_name ${server_name};
        ${locationTemplate(location, proxy_pass)}
    `
}

function searchLastServer(str, n = 0) {
    let index = str.indexOf('server {', n)
    // let index = str.search(/[^#]server([\s]*)\{/)
    return index !== -1 ? searchLastServer(str, index + 8) : n - 8
}

function searchServerLength(server) {
    return server.match(/server[\s]*\{[\s\S]*\}/g)[0].length
}

function searchHttp(str) {

}
