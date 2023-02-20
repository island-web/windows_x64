const { ipcRenderer } = require("electron");
const $ = require('jquery')
const shell = require('shelljs')
const values = require('./global_values.js')
const func = require('./functions')
const start_play = require('./player')
const update = require('./update')
const fs = require('fs');
const logs = require('./logs')

try { if (!fs.existsSync('music')) { fs.mkdirSync('music') } } catch (err) { console.error(err) }
try { if (!fs.existsSync('adv')) { fs.mkdirSync('adv') } } catch (err) { console.error(err) }
try { if (!fs.existsSync('tmp')) { fs.mkdirSync('tmp') } } catch (err) { console.error(err) }
try { if (!fs.existsSync('server')) { fs.mkdirSync('server') } } catch (err) { console.error(err) }






 if (localStorage.getItem('initialization') != 6) {
    if (localStorage.getItem('initialization') == undefined) { ipcRenderer.send("init", { massage: 'init' }) }
    else if (localStorage.getItem('initialization') == 1) {
        ipcRenderer.send("data_station", { massage: 'data_station' })
        ipcRenderer.send("hide_data_station", { massage: 'child_init_data' })
        $('.block-info-1').prepend(`<p>GET DATA STATION</p>`)
    }
    else if (localStorage.getItem('initialization') == 2) {
        fs.writeFile('./id.txt', values.get_id_station(), (err) => { if (err) console.log(err) })
        ipcRenderer.send("hide_child_id_music", { massage: 'hide_child_id_music' })
        $('.block-info-1').prepend(`<p>GET DATA PLAYLIST</p>`)
        ipcRenderer.send("id_music", { massage: 'id_music' })
    }
    else if (localStorage.getItem('initialization') == 3) {
        ipcRenderer.send("hide_child_all_pl_adv", { massage: 'hide_child_all_pl_adv' })
        $('.block-info-1').prepend(`<p>GET DATA ADV</p>`)
        ipcRenderer.send("all_pl_adv", { massage: 'all_pl_adv' })
    }
    else if (localStorage.getItem('initialization') == 4) {
        ipcRenderer.send("hide_get_first_songs", { massage: 'hide_get_first_songs' })
        $('.block-info-1').prepend(`<p>PREPARATION SONGS FOR DOWNLOAD</p>`)
        ipcRenderer.send("get_first_songs", { massage: 'get_first_songs' })
    }
    else if (localStorage.getItem('initialization') == 5) {
        //ipcRenderer.send("first_download_songs", { massage: 'first_download_songs' }) 
        //ipcRenderer.send("hide_get_first_download_songs", { massage: 'hide_get_first_download_songs' })
        document.getElementById('time_work').innerText = `${values.station()[0].start_work} - ${values.station()[0].stop_work}`
        document.getElementById('name_station').innerText = `${values.station()[0].name_station} ....`
        $('.block-info-1').prepend(`<p>START SONGS DOWNLOAD</p>`)
        func.download_songs(values.get_all_songs())
    }

} else {
    setTimeout(() => { ipcRenderer.send("min", { massage: 'min' }) }, 5000)
    logs.send_status()
    fs.writeFile('./id.txt', values.get_id_station(), (err) => { if (err) console.log(err) })


    if (localStorage.getItem('update_adv') == 2) { 
        func.get_all_adv(values.get_programs_adv(), values.adv_data_base())
        localStorage.setItem('update_adv', 1)
        setTimeout(() => { ipcRenderer.send("reload", { massage: 'RELOAD' }) }, 500)
    }
    else if (localStorage.getItem('update_adv') == 1) {
        localStorage.setItem('update_adv', 0)
        ipcRenderer.send("reload", { massage: 'RELOAD' })
    }
    else if (localStorage.getItem('update_playlist') == 3) {
        func.get_all_playlist(values.get_programs_music(), null)
        func.get_all_sp_playlist(values.get_programs_music(), null)
        localStorage.setItem('update_playlist', 2)
        setTimeout(() => { ipcRenderer.send("reload", { massage: 'RELOAD' }) }, 500)
    }
    else if (localStorage.getItem('update_playlist') == 2) {
        func.set_all_songs(values.get_all_playlist(), null)
        localStorage.setItem('update_playlist', 1)
        setTimeout(() => { ipcRenderer.send("reload", { massage: 'RELOAD' }) }, 500)
    }

    func.get_all_playlist(values.get_programs_music(), null)
    func.set_all_songs(values.get_all_playlist(), null)
    
    func.sortAdv()


    window.addEventListener('DOMContentLoaded', () => {
        document.getElementById('time_station').innerText = values.current_time('HH:mm')
        document.getElementById('time_work').innerText = `${values.station()[0].start_work} - ${values.station()[0].stop_work}`
        document.getElementById('name_station').innerText = `${values.station()[0].name_station} ....`
    })

    if (values.current_time('HH:mm:ss') >= values.station()[0].start_work && values.current_time('HH:mm:ss') < values.station()[0].stop_work) {
        logs.send_log(`START WORK`, 0, 'adv')
        localStorage.setItem('station_work', 'on')
        start_play.start()
        if(localStorage.getItem('update_adv') == 0 || localStorage.getItem('update_adv') == undefined) { func.download_adv(values.get_all_adv()) }
        if (localStorage.getItem('update_playlist') == 0 || localStorage.getItem('update_playlist') == undefined) { func.download_songs(values.get_all_songs()) }


    } else { localStorage.setItem('station_work', 'off') }

    let start_stopo_interval = setInterval(() => {
        if (values.current_time('HH:mm:ss') == values.station()[0].stop_work && localStorage.getItem('station_work') == 'on') {
            localStorage.setItem('station_work', 'off')
            ipcRenderer.send("reload", { massage: 'RELOAD' })
            clearInterval(start_stopo_interval)
        }
        if (values.current_time('HH:mm:ss') == values.station()[0].start_work && localStorage.getItem('station_work') == 'off') {
            localStorage.setItem('station_work', 'on')
            ipcRenderer.send("reload", { massage: 'RELOAD' })
            clearInterval(start_stopo_interval)
        }
        document.getElementById('time_station').innerText = values.current_time('HH:mm:ss')
    }, 1000)

    update.check_udate()

    //VISUAL FUNCTIONS
    let list_songs = JSON.parse(localStorage.getItem('current_playlist'), 'UTF-8');
    let list_adv = values.get_all_adv();
    let list_log = JSON.parse(localStorage.getItem('current_playlist'), 'UTF-8');


    if (localStorage.getItem('station_work') == 'on') {
        list_songs.forEach(element => {
            $('.add-song').prepend(`<p class='add-song-p'>
        <span>${element.id_song}</span>
        <span>${element.artist}  ${element.name_song}</span>
        <span>${element.id_playlist}</span>
        <span>${element.name_playlist}</span> 
        <span>${element.size}</span>
        <input type='hidden' class='add-song-search-inp' value='${element.id_song}${element.artist}${element.name_song}'>
        </p>`)
        });
    }
    ////////////////input search
    $(document).ready(function () {
        $('#check-play-list-input').on('input', function () {
            let val = this.value.replace(/ /g, '').toLowerCase();
            if (val != '') {
                $('.add-song-search-inp').each(function () {
                    if ($(this).val().toLowerCase().toString().replace(/ /g, '').search(val) == -1) {
                        $(this.parentNode).slideUp()
                    } else {
                        $(this.parentNode).show()
                    }
                })
            } else {
                $('.add-song-p').slideDown()
            }
        })
    })

    list_adv.forEach(el => {
        $('.add-adv').prepend(`<p class='add-adv-p'>
    <span class='span1'>${el.id_adv}</span>
    <span class='span2'>${el.name_adv}</span>
    <span class='span3'>${el.type} [${el.interval_t}]</span>
    <span class='span4'>${el.id_program}</span>
    <span class='span5'>[${values.get_my_date(new Date(el.date_start), 'DD-MM-YYYY')}--${values.get_my_date(new Date(el.date_stop), 'DD-MM-YYYY')}]</span>
    <span class='span6'>${el.time_start} ${el.time_stop}</span>
    <span class='span7'>${el.duration}</span>
    <span class='span8'>${parseInt(el.size / 1000)} kb</span>
    <input type='hidden' class='add-adv-search-inp' value='${el.id_adv}${el.name_adv}'>
    </p>`)
    });
    ////////////////
    $(document).ready(function () {////////////////input search
        $('#check-adv-list-input').on('input', function () {
            let val = this.value.replace(/ /g, '').toLowerCase();
            if (val != '') {
                $('.add-adv-search-inp').each(function () {
                    if ($(this).val().toLowerCase().replaceAll('_', '').replaceAll('.', '').toString().replace(/ /g, '').search(val) == -1) {
                        $(this.parentNode).slideUp()
                    } else {
                        $(this.parentNode).show()
                    }
                })
            } else {
                $('.add-adv-p').slideDown()
            }
        })
    })

    $(function () {
        $('.check-play-list').click(function () {
            $('.add-block-info-adv,.add-block-info-log,.block-info-main').hide();
            $('.add-block-info-songs').slideDown('slow');
            $('.check-play-list').addClass('check');
            $('.check-adv-list,.check-log-list').removeClass('check');

        })
    })
    ///////////////
    $(function () {
        $('.check-adv-list').click(function () {
            $('.add-block-info-songs,.add-block-info-log,.block-info-main').hide();
            $('.add-block-info-adv').slideDown('slow');
            $('.check-adv-list').addClass('check');
            $('.check-play-list,.check-log-list').removeClass('check');
        })
    })
    ///////////////
    $(function () {
        $('.check-log-list').click(function () {
            $('.add-block-info-songs,.add-block-info-adv,.block-info-main').hide();
            $('.add-block-info-log').slideDown('slow');
            $('.check-log-list').addClass('check');
            $('.check-adv-list,.check-songs-list').removeClass('check');
        })
    })
    ///////////////
    $(function () {
        $('.closed-block-info').click(function () {
            $('.add-block-info').slideUp();
            $('.block-info-main').slideDown();
            $('.check-adv-list,.check-log-list,.check-play-list').removeClass('check');
            $('#check-adv-list-input,#check-play-list-input').val('')
        })
    })
    $(function () {
        $('#name_station').mouseenter(function () {
            $('.station-info').fadeIn().html($('#name_station').html())
        })
        $('#name_station').mouseleave(function () {
            $('.station-info').fadeOut()
        })
    })

    $(function () {
        $('.initialization-btn').click(function () {//////////delete localstorage
            localStorage.clear()
            ipcRenderer.send("reload", { massage: 'RELOAD' })
        })
        $('.reload-btn').click(function () {/////reload btn
            ipcRenderer.send("reload", { massage: 'RELOAD' })
        })
        $('.support-btn-main').click(function () {
            $('.support-main').fadeIn()
        })
        $('.closed-block-support').click(function () {
            $('.support-main').fadeOut()
        })
        $('.support-btn').click(function () {//////////send btn
            func.send_mail($('.support-textarea').val())
            $('.support-main').fadeOut()
            $('.support-textarea').val('')
        })
    })
    
    $(document).ready(function () {////////////////input search
        $('.support-textarea').on('input', function () {
            if ($('.support-textarea').val() == '') {
                $('.support-btn').hide()
            } else {
                $('.support-btn').fadeIn()
            }
        })
    })
    
}
