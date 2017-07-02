'use strict'

const { app, BrowserWindow, ipcMain, Tray, nativeImage } = require('electron')
const path = require('path')
const url = require('url')
// const { getTray } = require('./js/tray')

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
})

let win
// let tray

const shouldQuit = app.makeSingleInstance(() => {
  // Someone tried to run a second instance, we should focus our window.
  if (win && win.isMinimized()) {
    win.restore()
    win.focus()
  }
})

if (shouldQuit) {
  app.quit()
}

function createWindow(width = 1220, height = 680, show = true) {
  win = new BrowserWindow({
    width,
    height,
    show
  })
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'html', 'prepare.html'),
      protocol: 'file',
      slashes: true
    })
  )

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

const showWindow = (win, tray) => {
  const trayPos = tray.getBounds()
  const windowPos = win.getBounds()
  let x,
    y = 0
  if (process.platform === 'darwin') {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2)
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2)
    y = Math.round(trayPos.y + trayPos.height * 10)
  }

  win.setPosition(x, y, false)
  win.show()
  win.focus()
}

const toggleWindow = (win, tray) => {
  if (win.isVisible()) {
    win.hide()
  } else {
    showWindow(win, tray)
  }
}

const handleClickTray = function(event, win, tray) {
  toggleWindow(win, tray)

  // Show devtools when command clicked
  if (win.isVisible() && process.defaultApp && event.metaKey) {
    win.openDevTools({ mode: 'detach' })
  }
}

app.on('ready', () => {
  const tray = new Tray(nativeImage.createFromPath(path.resolve('img/iconTemplate.png')))
  // const tray = getTray()

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('click', event => {
    handleClickTray(event, win, tray)
  })

  ipcMain.on('show-window', () => {
    showWindow(win, tray)
  })

  // Make the popup window for the menubar
  win = new BrowserWindow({
    width: 500,
    height: 620,
    show: false,
    frame: false,
    resizable: false
  })

  win.webContents.openDevTools()

  win.loadURL(`file://${path.join(__dirname, 'html/prepare.html')}`)

  // Only close the window on blur if dev tools isn't opened
  win.on('blur', () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.hide()
    }
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
