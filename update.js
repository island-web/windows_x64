const values = require('./global_values.js')
const func = require('./functions')
const logs = require('./logs')


let timer = values.get_timer()


module.exports.check_udate = function () {
    setInterval(() => {

        func.delete_adv()
        func.delete_songs()    

        func.set_data_station(values.get_id_station(), values.station_data_base())
        logs.send_status()

        //if (localStorage.getItem('update_adv') == 1) { localStorage.setItem('update_adv', 0); func.download_adv(values.get_all_adv()) } 
        if(localStorage.getItem('update_playlist') == 1) { localStorage.setItem('update_playlist', 0); func.download_songs(values.get_all_songs())}
        
        else {
            document.getElementById('time_work').innerText = `${values.station()[0].start_work} - ${values.station()[0].stop_work}`
            document.getElementById('name_station').innerText = values.station()[0].name_station
            
            func.check_udate_from_serv()
        }

    }, timer)
}
