// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

import {initDatabase,createTestData,getAllTestData,getSpecifiedTestData} from "../renderer/lib/database";
import {test_object_t,test_read_object_t} from "../renderer/types";


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

ipcMain.on('db-init',(event: IpcMainEvent) => {
  console.log("db-init");
  if( initDatabase() ) {
    event.sender.send("db-init-resp",true);
  } else {
    event.sender.send("db-init-resp",false);
  }
})

ipcMain.on("db-create",(event: IpcMainEvent,create_data:test_object_t) => {
  console.log("db-create : name = "+create_data.name + ",date = "+create_data.date);
  if(createTestData(create_data)) {
    event.sender.send("db-create-resp",true);
  } else {
    event.sender.send("db-create-resp",false);
  }
})

ipcMain.on("db-get-all",(event: IpcMainEvent) => {
  let get_contents:test_read_object_t[]|boolean=getAllTestData();
  if("boolean" == typeof get_contents) {
    event.sender.send("db-get-all-resp",false);
  } else {
    event.sender.send("db-get-all-resp",get_contents);
  }
})

ipcMain.on("db-get-specified-date",(event: IpcMainEvent,date:string) => {
  let get_contents:test_read_object_t[]|boolean=getSpecifiedTestData(date);
  if("boolean" == typeof get_contents) {
    event.sender.send("db-get-specified-date-resp",false);
  } else {
    event.sender.send("db-get-specified-date-resp",get_contents);
  }
})