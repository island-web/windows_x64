const { ipcRenderer } = require("electron");

let start_init = document.getElementById('start_init');
    
start_init.addEventListener('click', function () {
    localStorage.setItem('id_station', document.getElementById("id_station").value);
    localStorage.setItem('initialization', 1);
    
    ipcRenderer.send("close_init", { massage: 'close_init' });
})
