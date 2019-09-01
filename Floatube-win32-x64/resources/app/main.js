
const {app, BrowserWindow, Menu, MenuItem, ipcMain,session} = require('electron')

let win;
let windowOption={
  width: 800,
  height: 471,
  webPreferences: {
    nodeIntegration: true
  },
  titleBarStyle: 'customButtonsOnHover', frame: false
}
let tempPopupRef;
const menu = new Menu();
function createWindow(){

  win = new BrowserWindow(windowOption);
  win.loadFile('index.html');

  win.on('closed',() => {
    win = null;
  });
  menu.append(new MenuItem({
    label: 'Edit Address',
    accelerator: 'U',
    click: ()=>{
      win.webContents.send('toggle-url-input');

    }
  }));
  menu.append(new MenuItem({
    label: 'Open Devtools',
    accelerator:'F12',
    click:()=>{
      win.webContents.openDevTools();
    }
  }));

  menu.append(new MenuItem({
    label: 'Logout',
    accelerator:'CmdOrCtrl+L',
    click:()=>{
      let popup=new BrowserWindow();
      popup.setMenu(null);
      console.log(session.defaultSession.cookies.get({name:"LOGIN_INFO"}));
      if(session.defaultSession.cookies.get({name:"LOGIN_INFO"})!==[]){
        popup.loadURL('https://www.youtube.com/logout');
        popup.webContents.on('did-navigate',function(e, url){
          //if(url.indexOf("https://www.youtube.com")!=-1)
            console.log('navigating');
            popup.close();
            win.webContents.send('apply-url',null,e);

        })
      }else{

        popup.loadURL('https://accounts.google.com/ServiceLogin?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Dko%26next%3D%252F&hl=ko&ec=65620')



      }

      popup.webContents.session.webRequest.onBeforeRequest( function (details, callback) {
      if(details.url=='https://www.youtube.com/post_login'){
        win.webContents.send('apply-url',null);
        callback({
          cancel:true
        });
      }else{
      callback({
        cancel:false
      });
    }
      // process the callback url and get any param you need

      // don't forget to let the request proceed

      });



    }
  }))
  win.setMenu(menu);
  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    win.webContents.send('apply-url',url,e);
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
