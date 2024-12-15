import asyncio

from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import json
from .download_segments import SegmentsAndProgress

progress = SegmentsAndProgress()

from channels.generic.websocket import AsyncWebsocketConsumer
import json
import asyncio

import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .download_segments import SegmentsAndProgress

class WSConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
        # Ініціалізація об'єкта SegmentsAndProgress і передача WebSocket
        self.progress = SegmentsAndProgress(websocket=self)
        

    async def receive(self, text_data):
        # Обробка повідомлень від клієнта
        pass

    async def update_progress(self):
        while self.progress.percent_complete < 100:
            # Оновлюємо прогрес
            await self.progress.send_progress()
            await asyncio.sleep(1)

        # Завершальний прогрес після того, як завантаження завершено
        await self.progress.send_progress()

