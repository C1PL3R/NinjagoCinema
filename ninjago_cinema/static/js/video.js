function loadVideo(video, playlist) {
    if (Hls.isSupported()) {
        var hls = new Hls(); // Створюємо локальну змінну для HLS
        hls.loadSource(playlist); // Завантажуємо переданий плейлист
        hls.attachMedia(video); // Прикріплюємо медіа до елемента відео

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            // Прибираємо автоматичне відтворення відео
            // video.play().catch(error => {
            //     console.warn('Не вдалося автоматично відтворити відео:', error);
            // });
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
                console.error('Фатальна помилка HLS.js:', data);
            } else {
                console.warn('Попередження HLS.js:', data);
            }
        });

    } else {
        console.error('HLS не підтримується вашим браузером');
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

                // Завантажуємо відео через HLS.js
                loadVideo(video, 'http://127.0.0.1:8000' + movie.m3u8_url);

                // Додаємо весь блок у контейнер
                moviesContainer.appendChild(moviesDiv);
            });
        })
        .catch(error => console.error('Помилка при отриманні даних:', error));
});
