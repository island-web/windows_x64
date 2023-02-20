//const { ipcRenderer } = require("electron");
const values = require('./global_values.js')
const fs = require('fs')
const https = require('https')
const mysql = require('mysql2')
const logs = require('./logs')
const $ = require('jquery')
const Downloader = require("nodejs-file-downloader")
//const nodemailer = require("nodemailer")


module.exports.set_data_station = function (id_station, station_data_base) {
    station_data_base = mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_stations_lj', database: 'stations_list_infiniti', password: 'fpCB4MZ5' })
    let sql = `SELECT * FROM station WHERE id_station=${id_station}`
    station_data_base.query(sql, function (err, results) {
        if (err) { console.log("NO_CONNECTION"); station_data_base.end(); }
        else { localStorage.setItem('data_station', JSON.stringify(results)) }
        station_data_base.end()
    })

}

module.exports.set_program_id_music = function (id_station, global_data_base) {
    global_data_base = mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_global_inf', database: 'global_infiniti', password: 'Pf1vUdyO' })
    global_data_base.query(`SELECT id_program FROM stations_program WHERE id_station=${id_station}`,
        function (err, results) {
            if (err) { console.log(err); global_data_base.end() }
            else { localStorage.setItem('id_program_music', JSON.stringify(results)) }
            global_data_base.end()
        });

}

module.exports.set_adv_program_id = function (id_station, adv_data_base) {
    adv_data_base = mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_adv_infini', database: 'adv_infinity', password: 'nBAw8R03mKti' })
    adv_data_base.query(`SELECT id_program FROM stations_program WHERE id_station=${id_station}`,
        function (err, results) {
            if (err) { console.log(err); adv_data_base.end() }
            else { localStorage.setItem('id_program_adv', JSON.stringify(results)) }
            adv_data_base.end()
        });
}

module.exports.get_all_adv = function (id_program_adv, adv_data_base) {

    let temp_adv_storage = []
    localStorage.setItem('adv', JSON.stringify(temp_adv_storage))
    this.c(id_program_adv)
    id_program_adv.forEach(id_prog => {
        count = 0
        let temp_adv = []
        let db = mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_adv_infini', database: 'adv_infinity', password: 'nBAw8R03mKti' })
        db.query(`SELECT * FROM adv_program WHERE id_program = ${id_prog.id_program}`, function (err, results) {

            if (err) { console.log('ERROR CONNECTION TO [ DATA_ADV ]') }
            else {
                if (count != 0) { values.get_all_adv().forEach(el => { temp_adv.push(el) }) }

                results.forEach(element => {

                    if (values.get_my_date(new Date(element.date_start), "YYYY/MM/DD") <= values.today() && values.get_my_date(new Date(element.date_stop), "YYYY/MM/DD") >= values.today()) temp_adv.push(element)
                })
                count++
                localStorage.setItem('adv', JSON.stringify(temp_adv))
            }
            db.end()
        })
    })
}

module.exports.get_all_playlist = function (id_program_music, global_data_base) {
    global_data_base = mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_global_inf', database: 'global_infiniti', password: 'Pf1vUdyO' })
    sql = `SELECT * FROM playlist_for_program WHERE id_program=${id_program_music[0].id_program}`
    global_data_base.query(sql, function (err, results) {
        if (err) { console.log(err) }
        else { localStorage.setItem('all_playlist', JSON.stringify(results)) }
        global_data_base.end()
    });
}

module.exports.get_all_sp_playlist = function (id_program_music, global_data_base) {
    global_data_base = mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_global_inf', database: 'global_infiniti', password: 'Pf1vUdyO' })
    sql = `SELECT * FROM speciallist_for_program WHERE id_program=${id_program_music[0].id_program}`
    global_data_base.query(sql, function (err, results) {
        if (err) { console.log(err) }
        else { localStorage.setItem('all_sp_playlist', JSON.stringify(results)) }
        global_data_base.end()
    });

}

module.exports.set_all_songs = function (all_playlist, global_data_base) {
    let buffer = []
    let count = 0
    all_playlist.forEach(el => {
        global_data_base = mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_global_inf', database: 'global_infiniti', password: 'Pf1vUdyO' })
        sql = `SELECT * FROM music_for_pl WHERE id_playlist = ${el.id_playlist}`
        global_data_base.query(sql, function (err, results) {
            if (err) { console.log('ERROR CONNECTION TO [DATA_PLAYLIST]', err) }
            else {
                (count == 0) ? buffer = [] : buffer.push(JSON.parse(localStorage.getItem('all_music')))
                count++
                results.forEach(song => { buffer.push(song) })
                localStorage.setItem('all_music', JSON.stringify(buffer))
            }
        })
        global_data_base.end()
    })
}

module.exports.check_file = function (name, path) {
    let flag = true
    try { fs.accessSync(path + name, fs.F_OK) }
    catch (e) { flag = false }
    return flag
}

module.exports.checkSize = function (name, path) {

    var stats = fs.statSync(path + name);
    var fileSizeInBytes = stats["size"]
    return (Math.trunc(fileSizeInBytes));
}

module.exports.build_playlist = function (playlist) {
    temp_songs = []
    playlist.forEach(el => {
        if (values.get_my_date(new Date(el.date_start), 'YYYY/MM/DD') <= values.today() && values.get_my_date(new Date(el.date_stop), 'YYYY/MM/DD') >= values.today() &&
            el.time_start <= values.current_time('HH:mm:ss') && el.time_stop > values.current_time('HH:mm:ss')) {
            values.get_all_songs().forEach(song => {

                if (song.id_playlist == el.id_playlist) { temp_songs.push(song) }
            });
        }
    })
    let j, temp;
    for (let i = temp_songs.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = temp_songs[j];
        temp_songs[j] = temp_songs[i];
        temp_songs[i] = temp;
    }
    return temp_songs
}

module.exports.delete_adv = function () {
    if (values.get_all_adv() != null) {
        fs.readdir(`adv/`, (err, files) => {
            files.forEach(file => {
                let flag = 0;
                values.get_all_adv().forEach(el => {
                    if (el.name_adv == file) {
                        flag = 1;
                    }
                })
                if (flag != 1 && file !== '.DS_Store') {
                    fs.unlinkSync(`adv/${file}`);
                }
            });
            if (err) { console.log('ERROR') }
        });

    }
}

module.exports.delete_songs = function () {
    let temp_songs = []
    values.get_all_playlist().forEach(pl => {
        values.get_all_songs().forEach(song => {
            if (song.id_playlist == pl.id_playlist) temp_songs.push(`${song['artist']}-${song['name_song']}.mp3`)
        });
    })

    fs.readdir(`music/`, (err, files) => {
        files.forEach(file => {
            let flag = 0;
            temp_songs.forEach(el => {
                if (el == file) {
                    flag = 1;
                }
            })
            if (flag != 1 && file != '.DS_Store') {
                fs.unlinkSync(`music/${file}`);
            }
        });
        if (err) { console.log('ERROR') }
    });
    this.set_all_songs(values.get_all_playlist(), values.adv_data_base())
}

module.exports.sortAdv = function () {
    logs.send_log(`SORT_ADV`, 0, 'adv')
    let adv = values.get_all_adv()
    if (adv) {
        let adv_fix = []
        let adv_interval = []
        adv.forEach(element => {

            if (values.today() >= values.get_my_date(new Date(element.date_start), 'YYYY/MM/DD') && values.today() <= values.get_my_date(new Date(element.date_stop), 'YYYY/MM/DD')) {
                if (element.type == 'fix') { adv_fix.push(element) }
                else if (element.type == 'interval_t') { adv_interval.push(element) }
            }
        })
        localStorage.setItem('adv_fix', JSON.stringify(adv_fix))
        localStorage.setItem('adv_interval', JSON.stringify(adv_interval))
    }
    //console.log(JSON.parse(localStorage.getItem('adv_interval'), 'UTF-8'))
}

module.exports.c = function (val) { console.log(val) }

module.exports.download_songs = function (list) {

    //****************************************************************************************************** */
    //****************************************************************************************************** */
    let count_songs_download = 0;
    let songs = []
    let size = []
    let host = values.my_host()
    let song_undefined = 'undefined-undefined.mp3'

    function checkMusic(name, path = 'music/') {
        let flag = true;
        try { fs.accessSync(path + name, fs.F_OK) }
        catch (e) { flag = false }
        return flag;
    }
    if (list != null) {
        list.forEach(element => {
            if (!checkMusic(`${element['artist']}-${element['name_song']}.mp3`) && element['artist'] != '' && element['name_song'] != '') {
                if (`${element['artist']}-${element['name_song']}.mp3` != song_undefined) { localStorage.setItem('download_song', 1); songs.push(`${element['artist']}-${element['name_song']}.mp3`); size.push(element['size']) }
            }
        })

        if (songs.length > 0) {
            logs.send_log(`START_DOWNLOAD_SONGS`, 0, 'adv')
            $('.songs-elem').html(songs.length);
            function download(ur) {
                (async () => {

                    const downloader = new Downloader({
                        url: ur,
                        directory: "./music",
                        onProgress: function (percentage, chunk, remainingSize) {
                            //Gets called with each chunk.
                            //console.log("% ", percentage);
                            document.getElementById(count_songs_download).innerHTML = ` ${percentage} %, ${remainingSize / 1000} Mb `
                            //console.log("Current chunk of data: ", chunk);
                            //console.log("Remaining bytes: ", remainingSize);
                        },
                    });
                    try {
                        const { filePath, downloadStatus } = await downloader.download()
                        $('.songs-finish').html(count_songs_download);


                        count_songs_download++
                        if (count_songs_download < songs.length - 1) {
                            setTimeout(() => {
                                download(`${host}music/${songs[count_songs_download]}`)
                                $('.block-info-1').prepend(`<p>${count_songs_download} SONGS DOWNLOADED</p>`)
                                $('.block-info-1').prepend(`<p>[ DOWNLOAD  ${songs[count_songs_download]}] --- <span id='${count_songs_download}'></span></p>`)

                            }, 3000)
                        }
                        else {
                            localStorage.setItem('initialization', 6)
                            setTimeout(() => { ipcRenderer.send("reload", { massage: 'RELOAD' }) }, 10000)
                        }
                    } catch (error) {
                        console.log("Download failed", error)
                        $('.block-info-1').prepend(`<p>${songs[count_songs_download]} FAILED DOWNLOAD</p>`)
                        download(`${host}music/${songs[count_songs_download]}`)
                        $('.block-info-1').prepend(`<p>${count_songs_download} SONGS DOWNLOADED</p>`)
                        $('.block-info-1').prepend(`<p>[ DOWNLOAD  ${songs[count_songs_download]}] --- <span id='${count_songs_download}'></span></p>`)
                    }
                })();
            }
            download(`${host}music/${songs[count_songs_download]}`)
            $('.block-info-1').prepend(`<p>${songs.length} SONGS FOR DOWNLOAD</p>`)
            $('.block-info-1').prepend(`<p>[ DOWNLOAD  ${songs[count_songs_download]}] --- <span id='${count_songs_download}'></span></p>`)

        }

    }
}

module.exports.download_adv = function (list) {
    let count_songs_download = 0;
    let songs = []
    let size = []
    let host = values.my_host()
    let song_undefined = 'undefined.mp3'

    function checkADV(name) {
        let flag = true;
        console.log(`./adv/${name}`)
        try { fs.accessSync(`./adv/${name}`, fs.F_OK) }
        catch (e) { flag = false }
        return flag;
    }
    this.c(list)
    if (list != null) {
        list.forEach(element => {
            if (!checkADV(`${element['name_adv']}`)) {
                console.log(checkADV(`${element['name_adv']}`))
                if (`${element['name_adv']}` != song_undefined) { localStorage.setItem('download_adv', 1); songs.push(`${element['name_adv']}`); size.push(element['size']) }
            }
        })

        if (songs.length > 0) {
            logs.send_log(`START_DOWNLOAD_ADV`, 0, 'adv')
            function download(ur) {
                (async () => {

                    const downloader = new Downloader({
                        url: ur,
                        directory: "./adv",
                        onProgress: function (percentage, chunk, remainingSize) {
                            document.getElementById(count_songs_download).innerHTML = ` ${percentage} %, ${remainingSize / 1000} Mb `

                            /* console.log("% ", percentage); */
                            /* console.log("Current chunk of data: ", chunk); */
                            /* console.log("Remaining bytes: ", remainingSize); */
                        },
                    });
                    try {
                        const { filePath, downloadStatus } = await downloader.download()
                        console.log("All done")
                        count_songs_download++
                        if (count_songs_download < songs.length) {
                            setTimeout(() => {
                                download(`${host}adv/${songs[count_songs_download]}`)
                                $('.block-info-1').prepend(`<p>[ DOWNLOAD  ${songs[count_songs_download]}] --- <span id='${count_songs_download}'></span></p>`)
                            }, 3000)
                        }
                        else {
                            setTimeout(() => { ipcRenderer.send("reload", { massage: 'RELOAD' }) }, 60000)
                        }
                    } catch (error) {
                        console.log("Download failed", error)
                        download(`${host}adv/${songs[count_songs_download]}`)
                        $('.block-info-1').prepend(`<p>[ DOWNLOAD  ${songs[count_songs_download]}] --- <span id='${count_songs_download}'></span></p>`)
                    }
                })();
            }
            download(`${host}adv/${songs[count_songs_download]}`)
            $('.block-info-1').prepend(`<p>[ DOWNLOAD  ${songs[count_songs_download]}] --- <span id='${count_songs_download}'></span></p>`)
        }
    }
}

module.exports.update_soft = function () {
    let count = 0
    let host = values.my_host()
    function download(ur) {
        (async () => {

            const downloader = new Downloader({
                url: ur,
                directory: "./",
                onProgress: function (percentage, chunk, remainingSize) {
                    document.getElementById('new_version').innerHTML = ` ${percentage} %, ${remainingSize / 1000} Mb `
                    console.log("% ", percentage);
                    console.log("Current chunk of data: ", chunk);
                    console.log("Remaining bytes: ", remainingSize);
                },
            });
            try {
                const { filePath, downloadStatus } = await downloader.download()
                console.log("UPLOAD VERSION")
                reset('updata_soft', el.id_station, 3)
                setTimeout(() => { ipcRenderer.send("reload", { massage: 'RELOAD' }) }, 120000)
            } catch (error) {
                console.log("Download new version failed", error);
            }
        })();
    }
    download(`${host}update_64/update.zip`)
    $('.block-info-1').prepend(`<p>[ DOWNLOAD  NEW VERSION] --- <span id='new_version'></span></p>`)

}

module.exports.reset = function (col, id, val = 0) {
    console.log(col)
    let db = mysql.createConnection({ host: 'infiniti-pro.com', user: 'u_stations_lj', database: 'stations_list_infiniti', password: 'fpCB4MZ5' })
    let sql = `UPDATE station SET ${col}=${val} WHERE id_station=${id}`
    db.query(sql, function (err, results) {
        if (err) console.log(err)
        else console.log(results)
    })
    db.end()
}

module.exports.check_udate_from_serv = function () {
    let station = values.station()
    station.forEach(el => {
        if (el.update_adv == 1) {
            logs.send_log('UPDATE ADV', 0, 'adv')
            localStorage.setItem('update_adv', 2)
            this.set_adv_program_id(el.id_station, values.adv_data_base())
            this.reset('update_adv', el.id_station)
            el.update_adv = 0
            localStorage.setItem('data_station', JSON.stringify(station))
            setTimeout(() => { ipcRenderer.send("reload", { massage: 'RELOAD' }) }, 2000)
        }
        else if (el.updata_settings == 1) {
            logs.send_log('UPDATE SETTINGS', 0, 'adv')
            this.reset('updata_settings', el.id_station)
            el.updata_settings = 0
            localStorage.setItem('data_station', JSON.stringify(station))
            setTimeout(() => { ipcRenderer.send("reload", { massage: 'RELOAD' }) }, 2000)
        }
        else if (el.update_playlist == 1) {
            logs.send_log('UPDATE PLAYLIST', 0, 'adv')
            localStorage.setItem('update_playlist', 3)
            this.set_program_id_music(el.id_station, null)
            this.reset('update_playlist', el.id_station)
            el.update_playlist = 0
            localStorage.setItem('data_station', JSON.stringify(station))
            setTimeout(() => { ipcRenderer.send("reload", { massage: 'RELOAD' }) }, 2000)
        }
/*          else if (el.updata_soft == 2) {
            logs.send_log('UPDATE VERSION', 0, 'adv')
            el.updata_soft = 0
            localStorage.setItem('data_station', JSON.stringify(station))
            localStorage.setItem('updata_soft', 0)
            this.update_soft()
        }
 */     })
}

/* module.exports.send_mail = async function (massage) {
    alert('FANCTION WILL PUBLICATION LATER')

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'mailto:admsupport@tmm-ukraine.com',
            pass: 'Pa$$w0rd',
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `${values.station()[0].id_station} 👻 <mailto:test@mail.com>`, // sender address
        to: 'geka2109@gmail.com',
        subject: `message from station ${values.station()[0].name_station}`, // Subject line
        html: massage

    });
} */