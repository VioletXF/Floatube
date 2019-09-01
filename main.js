const {app, BrowserWindow, Menu, MenuItem, ipcMain} = require('electron')
let win;

const menu = new Menu();
function createWindow(){

  win = new BrowserWindow({
    width: 800,
    height: 471,
    webPreferences: {
      nodeIntegration: true
    },
    titleBarStyle: 'customButtonsOnHover', frame: false
  });
  win.loadFile('index.html');

  win.webContents.openDevTools();
  win.on('closed',() => {
    win = null;
  });
  menu.append(new MenuItem({
    label: 'Edit Address',
    accelerator: 'U',
    click: ()=>{
      win.webContents.send('toggle-url-input');

    }
  }))
  Menu.setApplicationMenu(menu);
  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    win.webContents.send('apply-url',url);
  });
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin'){
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null){
    createWindow();
  }
})
