const myPath = require('path')
const { VM_SIZE } = require('../config/config.json')

function getAppDir() {
  return (
    process.env.APPDATA ||
    (process.platform === 'darwin' ? myPath.join(process.env.HOME, 'Library', 'Application Support') : '/var/local')
  )
}

function getVmSize() {
  if (typeof VM_SIZE !== 'number') {
    throw new Error('VM_SIZE must be a number, receive: ', VM_SIZE)
  }
  return VM_SIZE * 1024 * 1024
}

module.exports = {
  getAppDir,
  getVmSize
}
