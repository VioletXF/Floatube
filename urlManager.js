const {ipcRenderer} = require('electron')
let showingInput=false;
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
ipcRenderer.on("apply-url",(event, url)=>{
  applyUrl(url)
});
function applyUrlFromElement(element){
  if(event.keyCode==13){
    var url=element.value;
    applyUrl(url);
  }
}
function applyUrl(url){
  console.log(url);
  var matched=url.match(/^(?: *?https?:\/\/(?:youtu\.be\/|(?:www)\.youtube\.com\/watch\?.*?v=)([^\/&\?]+)|(?!http)([^\/&\?]+))/);
  if(matched===null)return;
  var vid=matched[1]===undefined?matched[2]:matched[1];
  var embedUrl="https://www.youtube.com/embed/"+vid;
  console.log(embedUrl);
  document.getElementById("video-iframe").src=embedUrl;
}
