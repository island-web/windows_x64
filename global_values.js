const mysql = require('mysql2')
const fs = require('fs')
const day = require('date-and-time');


module.exports.get_my_date = function (my_date, format) { return day.format(my_date, format) }

module.exports.current_time = function (format) { return day.format(new Date(), format) }

module.exports.today = function () { return day.format(new Date(), 'YYYY/MM/DD') }

module.exports.my_host = function () { return 'https://infiniti-pro.com/' }

module.exports.get_programs_adv = function(){ return JSON.parse(localStorage.getItem('id_program_adv'), 'UTF-8') }

module.exports.get_programs_music = function(){ return JSON.parse(localStorage.getItem('id_program_music'), 'UTF-8') }

module.exports.get_all_playlist = function(){ return JSON.parse(localStorage.getItem('all_playlist'), 'UTF-8') }

module.exports.get_all_songs = function(){ return JSON.parse(localStorage.getItem('all_music'), 'UTF-8') }
 
module.exports.get_all_adv = function(){ return JSON.parse(localStorage.getItem('adv'), 'UTF-8') }

module.exports.get_all_adv_fix = function(){ return JSON.parse(localStorage.getItem('adv_fix'), 'UTF-8') }

module.exports.get_all_adv_interval = function(){ return JSON.parse(localStorage.getItem('adv_interval'), 'UTF-8') }

module.exports.station = function() { return JSON.parse(localStorage.getItem('data_station'), 'UTF-8') }

module.exports.get_id_station = function(){ return localStorage.getItem('id_station') }

module.exports.get_timer = function(){ if (localStorage.getItem('station_work') == 'off') return 60000; else return 60000 }

//DATA_BASE_CONNECTIONS
module.exports.global_data_base = function () {
    //return mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_global_inf', database: 'global_infiniti', password: 'Pf1vUdyO' })
    return null
}

module.exports.station_data_base = function () {
    //return mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_stations_lj', database: 'stations_list_infiniti', password: 'fpCB4MZ5' })
    return null
}

module.exports.adv_data_base = function () {
    //return mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_adv_infini', database: 'adv_infinity', password: 'nBAw8R03mKti' })
    return null
}

module.exports.addshedule_data_base = function () {
    //return mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_stations_lj', database: 'stations_list_infiniti', password: 'fpCB4MZ5' })
}

module.exports.logs_data_base = function () {
    //return mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_logs_for_sr', database: 'logs_for_station_infiniti', password: 'qSMrdZhK' })
    return null
}

