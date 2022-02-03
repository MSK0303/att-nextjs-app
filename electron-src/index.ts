// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

//import {att_data_t} from "../renderer/types";
import {initRecordManager,writeCommutingTime} from "../renderer/lib/recordManager";

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
  })

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      })
  mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);
  mainWindow.loadURL(url)
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message)
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500)
})

/**
 * database初期化
 */
ipcMain.on('db-init',(event:IpcMainEvent) => {
  console.log("db-init");
  let get_data = initRecordManager();
  if("boolean" == typeof get_data) {
    event.sender.send('db-init-resp-failed');
  } else {
    event.sender.send('db-init-success',get_data);
  }
})
/**
 * 出勤時間の書き込み・更新
 */
ipcMain.on('db-w-ct',(event:IpcMainEvent) => {
  console.log("db-w-ct");
  let resp = writeCommutingTime();
  if("boolean" == typeof resp) {
    event.sender.send('db-w-ct-failed');
  } else {
    event.sender.send('db-w-ct-success',resp);
  }
})