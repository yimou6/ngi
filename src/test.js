const path = require('path')
const fs = require('fs')


let doc = ''

try {
    const _doc = fs.readFileSync('D:\\yijiebin\\nginx-1.18.0\\conf\\nginxtest.conf')
    doc = _doc.toString()
} catch (e) {
    console.log('read file error', e)
}

serverParse(doc)

const serverReg = /[^#?](\s*)server(\s*)\{/

function serverParse(doc) {}

