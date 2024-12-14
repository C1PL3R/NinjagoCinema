var video = document.getElementById('video');
var hls;

var playlists = [
    '/media/Ninjago%2013%20season%2016%20episode/Ninjago%2013%20season%2016%20episode.m3u8'
];


function loadVideo() {
    if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(playlists[0]); // Завантажити плейлист
        hls.attachMedia(video); // Прикріпити медіа до елемента відео
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play(); // Автоматично почати відтворення після парсингу
        });
        hls.on(Hls.Events.ERROR, function (event, data) {
            console.error('HLS.js помилка:', data); // Вивести помилку, якщо вона сталася
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = playlists[0]; // Підтримка для Safari
        video.addEventListener('loadedmetadata', function () {
            video.play(); // Почати відтворення після завантаження метаданих
        });
    } else {
        console.error('HLS не підтримується вашим браузером'); // Якщо браузер не підтримує HLS
    }
}

loadVideo();
