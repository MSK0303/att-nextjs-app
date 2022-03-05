// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

//import {att_data_t} from "../renderer/types";
import {initRecordManager,writeCommutingTime,writeLeaveWorkTime,writeRestStartTime,writeGoOutStartTime,writeRestTotalTime,writeGoOutTotalTime,readTargetMonth,readTargetAttInfo} from "../renderer/lib/recordManager";

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
  let result = initRecordManager();
  if(result) {
    event.sender.send('db-init-resp',true);
  } else {
    event.sender.send('db-init-resp',false);
  }
});
/**
 * 出勤時間の書き込み・更新
 */
ipcMain.on('db-w-ct',(event:IpcMainEvent) => {
  console.log("db-w-ct");
  let resp = writeCommutingTime();
  if(resp) {
    event.sender.send('db-w-ct-resp',true,resp.commuting_time);
  } else {
    event.sender.send('db-w-ct-resp',false,null);
  }
});
/**
 * 退勤時間の書き込み・更新
 */
 ipcMain.on('db-w-lwt',(event:IpcMainEvent) => {
  console.log("db-w-lwt");
  let resp = writeLeaveWorkTime();
  if(resp) {
    event.sender.send('db-w-lwt-resp',true,resp.leave_work_time);
  } else {
    event.sender.send('db-w-lwt-resp',false,null);
  }
});
/**
 * 休憩開始時間の書き込み・更新
 */
 ipcMain.on('db-w-rst',(event:IpcMainEvent) => {
  console.log("db-w-rst");
  let resp = writeRestStartTime();
  if(resp) {
    event.sender.send('db-w-rst-resp',true,resp.rest_start_time);
  } else {
    event.sender.send('db-w-rst-resp',false,null);
  }
});
/**
 * 外出開始時間の書き込み・更新
 */
 ipcMain.on('db-w-gost',(event:IpcMainEvent) => {
  console.log("db-w-gost");
  let resp = writeGoOutStartTime();
  if(resp) {
    event.sender.send('db-w-gost-resp',true,resp.go_out_start_time);
  } else {
    event.sender.send('db-w-gost-resp',false,null);
  }
});
/**
 * 休憩時間の書き込み・更新
 */
 ipcMain.on('db-w-rtt',(event:IpcMainEvent) => {
  console.log("db-w-rtt");
  let resp = writeRestTotalTime();
  if(resp) {
    event.sender.send('db-w-rtt-resp',true,resp.rest_total_time);
  } else {
    event.sender.send('db-w-rtt-resp',false,null);
  }
});
/**
 * 外出時間の書き込み・更新
 */
 ipcMain.on('db-w-gott',(event:IpcMainEvent) => {
  console.log("db-w-gott");
  let resp = writeGoOutTotalTime();
  if(resp) {
    event.sender.send('db-w-gott-resp',true,resp.go_out_total_time);
  } else {
    event.sender.send('db-w-gott-resp',false,null);
  }
});
/**
 * 指定した年と月のデータを読み込み
 */
ipcMain.on("db-r-tm",(event:IpcMainEvent,year:number,month:number) => {
  console.log("db-r-tm");
  let resp = readTargetMonth(year,month);
  if(resp.length>0) {
    event.sender.send("db-r-tm-resp",true,resp);
  } else {
    event.sender.send("db-r-tm-resp",false,resp);
  }
});
/**
 * 指定した年と月のデータを読み込み
 */
 ipcMain.on("db-r-td",(event:IpcMainEvent,year:number,month:number,day:number) => {
  console.log("db-r-td");
  let resp = readTargetAttInfo(year,month,day);
  if(resp) {
    event.sender.send("db-r-td-resp",true,resp);
  } else {
    event.sender.send("db-r-td-resp",false,resp);
  }
});