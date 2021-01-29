const ARGV = [
    'info',
    'config',
    'init',
    'set',
    'rm'
]

const nginxIncludes = 'include ngi/*.conf;'

module.exports = {
    ARGV,
    nginxIncludes
}
