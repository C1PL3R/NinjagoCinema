import json
from random import randint
import asyncio

from channels.generic.websocket import WebsocketConsumer
from .download_segments import SegmentsAndProgress

progress = SegmentsAndProgress()

class WSConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

        # Передаємо WebSocket в об'єкт SegmentsAndProgress
        self.progress = SegmentsAndProgress(websocket=self)
        self.progress.send_progress()  # Надсилаємо початковий прогрес

    def receive(self, text_data):
        pass

    def update_progress(self):
        # Використовуємо асинхронне оновлення прогресу
        while self.progress.percent_complete < 100:
            self.progress.send_progress()
            asyncio.sleep(1)