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
                document.querySelector('#progress').innerText = `Wait please!`;
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
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// var socket = new WebSocket('ws://127.0.0.1:8000/ws/progress/')
// socket.onmessage = function (event) {
//     var data = JSON.parse(event.data)
//     console.log(data)
//     document.querySelector('#app').innerText = data.progress
// }
