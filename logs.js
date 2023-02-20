const fs = require('fs');
const mysql = require('mysql2');
const date = require('date-and-time');
const values = require('./global_values')
const $ = require('jquery')


module.exports.send_log = function (message, id_song, status, current_time, type = null) {

    let data = [message, id_song, status];
    let db = mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_logs_for_sr', database: 'logs_for_station_infiniti', password: 'qSMrdZhK' })
    db.query(`INSERT INTO ${values.station()[0].login_station} set date=CURRENT_DATE(), time=CURRENT_TIME(), info=?, id_song=?, status=?`,
        data, function (err) { if (err) $('.block-info-1').prepend(`ERROR_CONNECT_DB_LOGS_STR_25 ========> ${err}`) })
    db.end()
    
    $('.add-log').prepend(`<p class='add-song-p'>${date.format(new Date(), "YYYY/MM/DD HH:mm:ss")} ] --- ${message}</p>`)

    if (type == null) $('.block-info-1').prepend(`<p>[ ${date.format(new Date(), "YYYY/MM/DD HH:mm:ss")} ] --- ${message}</p>`)
    else if (type == 'adv') $('.block-info-1').prepend(`<p>[ ${date.format(new Date(), "YYYY/MM/DD HH:mm:ss")} ] --- ${message}</p>`)
    else if (type == 'error') $('.block-info-1').prepend(`<p>[ ${date.format(new Date(), "YYYY/MM/DD HH:mm:ss")} ] --- ${message}</p>`)

}

module.exports.send_status = function () {
    let db = mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_stations_lj', database: 'stations_list_infiniti', password: 'fpCB4MZ5' })
    db.query(`UPDATE station set online_time=CURRENT_TIME(), online_date=CURRENT_DATE(), version='v. 5.3.5 [ WIN--64 ]' WHERE id_station=${values.station()[0].id_station}`,
        function (err) {if (err) $('.block-info-1').prepend(` ERROR_CONNECT_DB_LOGS_STR_30 ========> ${err}`)})
    db.end();
}
