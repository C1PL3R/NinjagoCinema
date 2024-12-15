function loadVideo(videoElement, m3u8Url) {
    // Перевірка, чи підтримує браузер HLS.js
    if (Hls.isSupported()) {
        var hls = new Hls();

        // Якщо є проблема з парсингом м3u8, виводимо помилку
        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
                switch (data.fatal) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error('Мережевий збій при завантаженні м3u8');
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error('Помилка медіа (наприклад, помилка декодування)');
                        break;
                    case Hls.ErrorTypes.OTHER_ERROR:
                        console.error('Інша помилка HLS.js');
                        break;
                    default:
                        console.error('Невідома помилка HLS.js');
                }
            }
        });

        // Завантажуємо m3u8 файл
        hls.loadSource(m3u8Url);

        // Підключаємо до відео елемента
        hls.attachMedia(videoElement);

        // Запускаємо відтворення
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            videoElement.play();
        });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Підтримка для Safari, який підтримує HLS без HLS.js
        videoElement.src = m3u8Url;
        videoElement.addEventListener('loadedmetadata', function () {
            videoElement.play();
        });
    } else {
        console.error('Ваш браузер не підтримує HLS');
    }
}




document.addEventListener('DOMContentLoaded', function () {
    fetch('http://127.0.0.1:8000/api/movie/')
        .then(response => response.json())
        .then(data => {
            const moviesContainer = document.querySelector('.movies-container');

            // Перевіряємо наявність контейнера
            if (!moviesContainer) {
                console.error('Контейнер .movies-container не знайдено');
                return;
            }

            // Перевіряємо, чи є фільми
            if (data.length === 0) {
                const noMoviesMessage = document.createElement('p');
                noMoviesMessage.textContent = 'Фільмів не знайдено.';
                moviesContainer.appendChild(noMoviesMessage);
                return;
            }

            // Додаємо фільми у контейнер
            data.forEach(movie => {
                const moviesDiv = document.createElement('div');
                moviesDiv.classList.add('movies_div');

                // Додаємо заголовок
                const title = document.createElement('h1');
                title.textContent = movie.title;
                title.classList.add('title');
                moviesDiv.appendChild(title);

                // Додаємо відео
                const video = document.createElement('video');
                video.width = 640;
                video.height = 360;
                video.controls = true;
                video.playsInline = true;
                video.preload = 'metadata';
                moviesDiv.appendChild(video);
                
                const baseUrl = "http://127.0.0.1:8000"; // базовий URL
                const m3u8Url = baseUrl + movie.m3u8_url.replace('./', '/'); // виправляємо шлях, якщо він починається з './'

                console.log('M3U8 URL:', m3u8Url);

                // Завантажуємо відео через HLS.js
                loadVideo(video, movie.m3u8_url);

                // Додаємо весь блок у контейнер
                moviesContainer.appendChild(moviesDiv);
            });
        })
        .catch(error => console.error('Помилка при отриманні даних:', error));
});
