// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = require('electron')
const path = require('path')


function createWindow() {
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })
  mainWindow.loadFile('index.html')
  mainWindow.webContents.openDevTools()

  const child_init = new BrowserWindow({
    parent: mainWindow,
    width: 1900,
    height: 1200,
    modal: true,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }

  })

  const child_init_data = new BrowserWindow({
    parent: mainWindow,
    width: 1900,
    height: 1200,
    modal: true,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  const child_id_music = new BrowserWindow({
    parent: mainWindow,
    width: 1900,
    height: 1200,
    modal: true,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  const child_all_pl_adv = new BrowserWindow({
    parent: mainWindow,
    width: 1900,
    height: 1200,
    modal: true,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })


  const get_first_songs = new BrowserWindow({
    parent: mainWindow,
    width: 1900,
    height: 1200,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  const get_first_download_songs = new BrowserWindow({
    parent: mainWindow,
    width: 1900,
    height: 1200,
    modal: true,
    frame: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  //INIT WINDOW
  ipcMain.on("init", (event, args) => { child_init.loadFile(`init.html`); child_init.show() })

  ipcMain.on("data_station", (event, args) => { child_init_data.loadFile(`data_station.html`) })

  ipcMain.on("id_music", (event, args) => { child_id_music.loadFile(`id_music.html`) })

  ipcMain.once("all_pl_adv", (event, ...args) => { child_all_pl_adv.loadFile('all_pl_adv.html') })

  ipcMain.once("get_first_songs", (event, ...args) => { get_first_songs.loadFile('get_first_songs.html') })

  ipcMain.once("first_download_songs", (event, ...args) => { get_first_download_songs.loadFile('get_first_download_songs.html'); get_first_download_songs.show() })


  ipcMain.on("min", (event, args) => { mainWindow.minimize() })
  ipcMain.on("hide_data_station", (event, args) => { child_init_data.hide() })
  ipcMain.on("hide_child_id_music", (event, args) => { child_id_music.hide() })
  ipcMain.on("hide_child_all_pl_adv", (event, args) => { child_all_pl_adv.hide() })
  ipcMain.on("hide_get_first_songs", (event, args) => { get_first_songs.hide() })
  ipcMain.on("hide_get_first_download_songs", (event, args) => { get_first_download_songs.hide() })

  ipcMain.on("reload", (event, args) => {
    mainWindow.reload()
  })
  //END INIT WINDOW



  //WORK_EVENTS

  //close_init_window
  ipcMain.once("close_init", (event, args) => { child_init.close(); setTimeout(() => { mainWindow.reload() }, 2000) })

  ipcMain.once("close_data_station", (event, args) => { child_init_data.close(); setTimeout(() => { mainWindow.reload() }, 2000) })

  ipcMain.once("close_id_music", (event, args) => { child_id_music.close(); setTimeout(() => { mainWindow.reload() }, 2000) })

  ipcMain.once("close_all_pl_adv", (event, args) => { child_all_pl_adv.close(); if (args != 'no_reload') { setTimeout(() => { mainWindow.reload() }, 2000) } })

  ipcMain.once("close_get_first_songs", (event, ...args) => { get_first_songs.close(); mainWindow.reload() })

  ipcMain.once("close_get_first_download_songs", (event, ...args) => { get_first_download_songs.close(); mainWindow.reload() })


}

app.whenReady().then(() => {
  createWindow()
  let min
  if (process.platform === 'darwin') { min = 'front' }
  else { min = 'minimize' }
  const template = [
    {
      label: app.name,
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Menu',
      submenu: [
        {
          label: 'system information',
          click() {
            console.log('Not info')
          }
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { role: 'togglefullscreen' },
        { type: 'separator' }
      ]
    },
    {
      label: 'Window',
      submenu: [

        { role: min },
        { role: 'hide' },
        { role: 'close' }
      ]
    }

  ]
  let tray = null;

  function initTray(mainWindow) {
    app.whenReady().then(() => {
      tray = new Tray(path.join(__dirname, 'assets', 'img', 'icon.ico'));
      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'TMM',
          click: function () {
            mainWindow.show();
          }
        },
        {
          label: 'Quit',
          type: 'normal',
          click: function () {
            app.isQuiting = true;
            app.quit();
          }
        }
      ]);
      tray.setToolTip('TMM');
      tray.setContextMenu(contextMenu);
    });

    mainWindow.on('close', function (event) {
      if (!app.isQuiting) {
        event.preventDefault();
        mainWindow.hide();
      }
      return false;
    });
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  initTray(mainWindow)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  /* if (process.platform !== 'darwin') */ app.quit()
})
