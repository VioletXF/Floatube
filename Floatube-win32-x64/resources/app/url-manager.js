const {ipcRenderer} = require('electron')
const {BrowserWindow} = require('electron').remote
let showingInput=false;
var currentVideoURL=null;
ipcRenderer.on('toggle-url-input',(event)=>{
  showingInput=!showingInput;
  if(showingInput){
    let element=document.getElementById("yturl");
    element.style.display="block";
    element.focus();
  }else{
    document.getElementById("yturl").style.display="none"
  }
})
ipcRenderer.on("apply-url",(event, url,e)=>{
  let uurl=url;
  if(url===null)uurl=currentVideoURL;
  if(!applyUrl(uurl)){
    e.newGuest=new BrowserWindow(e.options);
    e.newGuest.setMenu(null);
    e.newGuest.loadURL(uurl);
  }

});
function applyUrlFromElement(element){
  if(event.keyCode==13){
    var url=element.value;
    if(applyUrl(url)){
      document.getElementById("yturl").style.display="none";
      document.getElementById("video-iframe").style.display="block";
    }
  }
}
function applyUrl(url){
  console.log(url);
  var matched=url.match(/^(?: *?https?:\/\/(?:youtu\.be\/|(?:www)\.youtube\.com\/watch\?.*?v=)([^\/&\?]+)|(?!http)([^\/&\?]+))/);
  if(matched===null)return false;
  var vid=matched[1]===undefined?matched[2]:matched[1];
  var embedUrl="https://www.youtube.com/embed/"+vid;
  console.log(embedUrl);

  document.getElementById("video-iframe").src=embedUrl;
  currentVideoURL=vid;
  return true;
}
