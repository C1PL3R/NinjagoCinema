document.addEventListener('DOMContentLoaded', function () {
    var burgerMenu = document.getElementById('burger-menu');
    var overlay = document.getElementById('menu');

    burgerMenu.addEventListener('click', function () {
        this.classList.toggle('close');
        overlay.classList.toggle('overlay');
    });
});


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Функція для завантаження сегментів
function DownloadSegments() {
    let link_input = document.getElementById('link_input').value;
    let title_of_movie = document.getElementById('title').value;
    let minutes = document.getElementById('minutes').value;  // Збираємо значення з інпуту

    fetch('/download_segments/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            'minutes': minutes,
            'title': title_of_movie,
            'url_for_segments': link_input,
        })
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Отримуємо JSON відповідь
            } else {
                console.error('Помилка відповіді сервера:', response.status);
                return response.text().then(text => {
                    console.error('Текст помилки:', text);
                });
            }
        })
        .then(data => {
            console.log('Успішна відповідь:', data);
            const status_added_movie = data?.status_added_movie || "Статус відсутній";
            if (status_added_movie) {
                const title = document.createElement('h1');
                title.textContent = status_added_movie;
                title.classList.add('status_added_movie');
                document.body.appendChild(title);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    var socket = new WebSocket('ws://127.0.0.1:8000/ws/progress/')

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log('Отримано повідомлення:', data);

        // Перевірка, чи отримали успішну відповідь від сервера
        if (data.status && data.status === 'success') {
            console.log('Успішна відповідь:', data.status_added_movie);

            // Закриваємо WebSocket після отримання успішної відповіді
            socket.close();
        }

        // Виведення прогресу
        if (data.progress) {
            document.querySelector('#progress').innerText = `${data.progress}%`;
        }
    };

    // Після цього ви можете додати функцію для обробки закриття з'єднання (за бажанням)
    socket.onclose = function (event) {
        console.log('WebSocket з\'єднання закрито:', event);
    };

    // Якщо буде помилка
    socket.onerror = function (event) {
        console.error('Помилка WebSocket:', event);
    };


}


