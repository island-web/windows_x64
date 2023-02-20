const { event, valHooks } = require('jquery')
const func = require('./functions')
const values = require('./global_values')
const date = require('date-and-time');
const logs = require('./logs')
const $ = require('jquery')

let os = process.platform;

let directory = (os == 'darwin') ? '' : '../../'
let flag_play_adv = false
let vol = 70
buffer_for_wait = []

//interval.interval()
module.exports.start = function () {
    let list_song = func.build_playlist(values.get_all_playlist())
    localStorage.setItem('current_playlist', JSON.stringify(list_song))
    let count_songs = 0
    let volume_song = vol / 100
    let player = document.getElementById('song')
    let player_interval = document.getElementById('interval')
    let player_fixed = document.getElementById('fixed')

    player.volume = volume_song
    player.setAttribute('src', `${directory}music/${list_song[count_songs].artist}-${list_song[count_songs].name_song}.mp3`)
    $('.play-now').html(`[${list_song[count_songs].artist}-${list_song[count_songs].name_song}]`)
    logs.send_log(`START PLAY: ${list_song[count_songs].artist}-${list_song[count_songs].name_song}.mp3`, list_song[count_songs].id_song, null)
    setInterval(() => {
        let current_time = player.currentTime
        let min = parseInt(current_time / 60)
        let sec = parseInt(current_time % 60)
        if (min < 10) min = `0${min}`
        if (sec < 10) sec = `0${sec}`
        $('.current').html(`[${min}:${sec}] --`)
    }, 1000)

    setTimeout(() => {
        let sec = parseInt(player.duration % 60)
        let min = parseInt(player.duration / 60)
        if (min < 10) min = `0${min}`
        if (sec < 10) sec = `0${sec}`
        $('.duration').html(`[${min}:${sec}]`)
    }, 1000)


    player.play()


    player.addEventListener('ended', event => {
        count_songs++
        if (count_songs == list_song.length) {
            count_songs = 0
            list_song = func.build_playlist(values.get_all_playlist())
        }
        player.setAttribute('src', `${directory}music/${list_song[count_songs].artist}-${list_song[count_songs].name_song}.mp3`)
        $('.play-now').html(`[${list_song[count_songs].artist}-${list_song[count_songs].name_song}]`)
        logs.send_log(`START PLAY: ${list_song[count_songs].artist}-${list_song[count_songs].name_song}.mp3`, list_song[count_songs].id_song, null)
        setInterval(() => {
            let current_time = player.currentTime
            let min = parseInt(current_time / 60)
            let sec = parseInt(current_time % 60)
            if (min < 10) min = `0${min}`
            if (sec < 10) sec = `0${sec}`
            $('.current').html(`[${min}:${sec}] --`)
        }, 1000)

        setTimeout(() => {
            let sec = parseInt(player.duration % 60)
            let min = parseInt(player.duration / 60)
            if (min < 10) min = `0${min}`
            if (sec < 10) sec = `0${sec}`
            $('.duration').html(`[${min}:${sec}]`)
        }, 1000)
        player.play()
    })

    player.addEventListener('error', event => {
        logs.send_log(`ERROR PLAY SONG ${list_song[count_songs].artist}-${list_song[count_songs].name_song}.mp3`, list_song[count_songs].id_song, 'error')
        ipcRenderer.send("reload", { massage: 'RELOAD' })
    })

    function start_interval(list_adv) {
        let count = 0

        player_interval.setAttribute('volume', 80 / 100)
        player_interval.setAttribute('src', `${directory}adv/${list_adv[count]}`)

        $('.play-now').html(`[${list_adv[count]}]`)
        setInterval(() => {
            let current_time = player_interval.currentTime
            let min = parseInt(current_time / 60)
            let sec = parseInt(current_time % 60)
            if (min < 10) min = `0${min}`
            if (sec < 10) sec = `0${sec}`
            $('.current').html(`[${min}:${sec}] --`)
        }, 1000)

        setTimeout(() => {
            let sec = parseInt(player_interval.duration % 60)
            let min = parseInt(player_interval.duration / 60)
            if (min < 10) min = `0${min}`
            if (sec < 10) sec = `0${sec}`
            $('.duration').html(`[${min}:${sec}]`)
        }, 1000)

        logs.send_log(`START PLAY INTERVAL ADV: [${list_adv[count]}]`, 0, 'adv')

        player_interval.play()
        player_interval.addEventListener('ended', event => {
            count++
            if (count == list_adv.length) {
                if (buffer_for_wait.length == 0) {

                    flag_play_adv = false
                    volume_song = vol / 100
                    player.volume = volume_song
                    logs.send_log(`START PLAY AFTER PAUSE: ${list_song[count_songs].artist}-${list_song[count_songs].name_song}.mp3`, list_song[count_songs].id_song, null)
                    setInterval(() => {
                        let current_time = player.currentTime
                        let min = parseInt(current_time / 60)
                        let sec = parseInt(current_time % 60)
                        if (min < 10) min = `0${min}`
                        if (sec < 10) sec = `0${sec}`
                        $('.current').html(`[${min}:${sec}] --`)
                    }, 1000)
                    setTimeout(() => {
                        let sec = parseInt(player.duration % 60)
                        let min = parseInt(player.duration / 60)
                        if (min < 10) min = `0${min}`
                        if (sec < 10) sec = `0${sec}`
                        $('.duration').html(`[${min}:${sec}]`)
                    }, 1000)
                    player.play()

                }
                else {
                    let temp = buffer_for_wait
                    start_interval(temp)
                    buffer_for_wait = []
                    logs.send_log(`START PLAY BUFFER`, 0, 'adv')
                }
            } else if (count < list_adv.length) {
                player_interval.volume = 80 / 100
                player_interval.setAttribute('src', `${directory}adv/${list_adv[count]}`)
                logs.send_log(`START PLAY INTERVAL ADV: [${list_adv[count]}]`, 0, 'adv')
                $('.play-now').html(`[${list_adv[count]}]`)
                setInterval(() => {
                    let current_time = player_interval.currentTime
                    let min = parseInt(current_time / 60)
                    let sec = parseInt(current_time % 60)
                    if (min < 10) min = `0${min}`
                    if (sec < 10) sec = `0${sec}`
                    $('.current').html(`[${min}:${sec}] --`)
                }, 1000)

                setTimeout(() => {
                    let sec = parseInt(player_interval.duration % 60)
                    let min = parseInt(player_interval.duration / 60)
                    if (min < 10) min = `0${min}`
                    if (sec < 10) sec = `0${sec}`
                    $('.duration').html(`[${min}:${sec}]`)
                }, 1000)
                player_interval.play()
            }
        })
    }

    function check_time_fix_adv(all_duration) {
        let f = true;
        let start_interval = new Date();
        let end_interval = new Date(start_interval.getTime() + all_duration * 1000);
        try {
            let arr = values.get_all_adv_fix()
            if ((typeof arr) == 'object') {
                values.get_all_adv_fix().forEach(obj => {
                    if (date.format(start_interval, 'HH:mm:ss') <= obj.fix && date.format(end_interval, 'HH:mm:ss') >= obj.fix) {
                        f = false;
                        console.log(f);
                    }
                });
            }

        } catch (e) {
            console.log('err fix adv')
        }
        return f;
    }

    function interval() {
        let in_additional = []
        let adv_interval = values.get_all_adv_interval()

        if (adv_interval) {
            adv_interval.forEach(obj => {
                if (in_additional.length > 0) {
                    let f = 0
                    in_additional.forEach(element => {
                        if (element[0] == obj.interval_t) {
                            element[1].push(obj)
                            f = 1
                        }
                    })
                    if (f == 0) {
                        in_additional.push([obj.interval_t, [obj]])
                    }
                } else {

                    in_additional.push([obj.interval_t, [obj]])
                }
            })

            in_additional.forEach(element => {
                let play_now = []
                let dur = 0
                let interval
                element.forEach(el => {
                    if ((typeof el) == 'number') interval = el
                    else if ((typeof el) == 'object') {
                        let play_list = el
                        el.forEach(adv => {
                            if (adv.time_stop > date.format(new Date(), 'HH:mm:ss') && adv.time_start <= date.format(new Date(), 'HH:mm:ss')) {
                                play_now.push(adv.name_adv)
                                dur += adv.duration
                            }
                        })

                        setInterval(() => {
                            let f = false;

                            play_list.forEach(adv => {
                                if (adv.time_stop > date.format(new Date(), 'HH:mm:ss') && adv.time_start <= date.format(new Date(), 'HH:mm:ss') && !play_now.includes(adv.name_adv)) {
                                    f = true;

                                } else if (adv.time_stop < date.format(new Date(), 'HH:mm:ss') && play_now.includes(adv.name_adv)) {
                                    f = true;

                                }
                            })


                            if (!f && play_now.length > 0) {
                                if (flag_play_adv || !check_time_fix_adv(dur)) {
                                    if (buffer_for_wait.length > 0) { play_now.forEach(adv => { buffer_for_wait.push(adv) }) }
/**????????????????????? */         else { buffer_for_wait = play_now }
                                    console.log(buffer_for_wait)
                                } else {
                                    flag_play_adv = true;
                                    let v = vol;
                                    let pause_interval = setInterval(function () {
                                        v -= 5
                                        player.volume = v / 100
                                        if (v == 0) {
                                            player.pause()
                                            start_interval(play_now);
                                            clearInterval(pause_interval);
                                        }
                                    }, 500)
                                }
                            }

                        }, dur * 1000 + interval * 60000)
                    }
                })
            });
        }
    }

    function fixed() {
        let play_now
        let arr
        try {
            arr = values.get_all_adv_fix()
        } catch (e) {
            console.log('NO FIXED ADV')
        }

        if ((typeof arr) == 'object') {
            fixed_interval = setInterval(() => {

                arr.forEach(obj => {


                    if (date.format(new Date(), 'HH:mm') == obj.fix.slice(0, 5) && obj.id_string != play_now) {
                        play_now = obj.id_string;
                        flag_play_adv = true;
                        let v = vol;
                        let pause_interval = setInterval(function () {
                            v -= 5
                            player.volume = v / 100
                            if (v == 0) {
                                player.pause()
                                player_fixed.setAttribute('src', `${directory}adv/${obj.name_adv}`)
                                logs.send_log(`START PLAY FIXED ADV: [${obj.name_adv}]`, 0, 'adv')
                                player_fixed.volume = 80 / 100
                                $('.play-now').html(`[${obj.name_adv}]`)
                                setInterval(() => {
                                    let current_time = player_fixed.currentTime
                                    let min = parseInt(current_time / 60)
                                    let sec = parseInt(current_time % 60)
                                    if (min < 10) min = `0${min}`
                                    if (sec < 10) sec = `0${sec}`
                                    $('.current').html(`[${min}:${sec}] --`)
                                }, 1000)

                                setTimeout(() => {
                                    let sec = parseInt(player_fixed.duration % 60)
                                    let min = parseInt(player_fixed.duration / 60)
                                    if (min < 10) min = `0${min}`
                                    if (sec < 10) sec = `0${sec}`
                                    $('.duration').html(`[${min}:${sec}]`)
                                }, 1000)
                                player_fixed.play()
                                clearInterval(pause_interval);
                            }
                        }, 500)

                        player_fixed.addEventListener('ended', event => {
                            if (buffer_for_wait.length > 0) {
                                let temp = buffer_for_wait
                                start_interval(temp)
                                buffer_for_wait = []
                                logs.send_log(`START PLAY BUFFER`, 0, null)
                            }else{
                                flag_play_adv = false
                                player.volume = vol / 100
                                setInterval(() => {
                                    let current_time = player.currentTime
                                    let min = parseInt(current_time / 60)
                                    let sec = parseInt(current_time % 60)
                                    if (min < 10) min = `0${min}`
                                    if (sec < 10) sec = `0${sec}`
                                    $('.current').html(`[${min}:${sec}] --`)
                                }, 1000)
                                setTimeout(() => {
                                    let sec = parseInt(player.duration % 60)
                                    let min = parseInt(player.duration / 60)
                                    if (min < 10) min = `0${min}`
                                    if (sec < 10) sec = `0${sec}`
                                    $('.duration').html(`[${min}:${sec}]`)
                                }, 1000)
                                logs.send_log(`START PLAY AFTER PAUSE: ${list_song[count_songs].artist}-${list_song[count_songs].name_song}.mp3`, list_song[count_songs].id_song, null)
                                player.play()    
                            }
                        })
                    }
                });

            }, 1000);
        }
    }

    interval()
    fixed()
}