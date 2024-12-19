import os
import subprocess
import threading
import eel
from time import sleep

# Шлях до вашої папки з Eel
eel.init("static")  # вказати папку зі статичними файлами (HTML, JS)

def run_django():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ninjago_cinema.settings')
    subprocess.run(["python", r"C:\Users\Hom\Desktop\NinjagoCinema (GitHub)\NinjagoCinema\ninjago_cinema\manage.py", "runserver", "127.0.0.1:8000"])  # Запуск серверу Django на 8000

def run_eel():
    eel.start("start.html", size=(800, 600), port=8000)

# Запуск двох потоків для Django та Eel
if __name__ == "__main__":
    threading.Thread(target=run_django).start()
    sleep(3)  # Зачекайте 3 секунди для запуску сервера Django
    run_eel()  # Запуск Eel після цього
