const path = require('path')
const fs = require('fs')
const CONFIG = require('../config/config.json')
const colors = require('colors')
const moment = require('moment')
moment().format()

function getAppDir() {
  return (
    process.env.APPDATA ||
    (process.platform === 'darwin' ? path.join(process.env.HOME, 'Library', 'Application Support') : '/var/local')
  )
}

function getVmSizeByGb(size = 1024) {
  return size * 1024 * 1024 //默认1024G
}

function mkdirIfNotExist(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

function logExec(cmd, prefix = 'localExec') {
  const { logDir, execLogFileName } = CONFIG
  mkdirIfNotExist(logDir)
  fs.appendFile(
    path.join(logDir, execLogFileName),
    `[${moment().format('YYYY:MM:DD:kk:mm:ss').grey}] ${prefix}: ${cmd}\n`,
    function(err) {
      if (err) console.error(err)
    }
  )
}

module.exports = {
  getAppDir,
  getVmSizeByGb,
  logExec
}
