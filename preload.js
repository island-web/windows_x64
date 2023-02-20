const { ipcRenderer } = require("electron");
let OS = process.platform;
console.log(OS)






window.addEventListener('DOMContentLoaded', () => {
    
    document.getElementById('title').innerText = `ELECTRON-${OS}-64`
    
})
