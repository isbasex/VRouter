const fs = require('fs-extra')
const path = require('path')

const daemonScriptName = `daemon.sh`
const globalDaemonsDir = '/Library/LaunchDaemons'
const launchScript = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>vrouter</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <false/>
    <key>ProgramArguments</key>
    <array>
      <string>${path.resolve(daemonScriptName)}</string>
    </array>
    <key>StandardErrorPath</key>
    <string>/tmp/vrouter.err</string>
    <key>StandardOutPath</key>
    <string>/tmp/vrouter.out</string>
  </dict>
</plist>
`.trim()

const dest = path.resolve(globalDaemonsDir, 'vrouter.plist')

fs
  .writeFile(dest, launchScript)
  .then(() => fs.readFile(dest, 'utf8'))
  .then(file => {
    if (file === launchScript) {
      console.log('launchScript 写入成功')
      console.log(file)
    } else {
      console.log('launchScript 写入失败')
    }
  })
  .catch(console.error)

const daemonScript = `
#!/bin/bash

PATH=/usr/local/bin:$PATH

cd ${path.resolve()}
./node_modules/.bin/electron .
`.trim()

fs
  .writeFile(daemonScriptName, daemonScript)
  .then(() => fs.readFile(daemonScriptName, 'utf8'))
  .then(file => {
    if (file === daemonScript) {
      console.log('daemonScript 写入成功')
      console.log(file)
    } else {
      console.log('daemonScript 写入失败')
    }
  })
  .catch(console.error)
