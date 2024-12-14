import os
import aiohttp
import json


class SegmentsAndProgress:
    def __init__(self, websocket=None):
        self.percent_complete = 0
        self.segments = []
        self.websocket = websocket  # Зберігаємо з'єднання WebSocket

    async def download_file(self, session, url, save_path):
        try:
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            async with session.get(url) as response:
                response.raise_for_status()
                with open(save_path, 'wb') as file:
                    async for chunk in response.content.iter_chunked(8192):
                        file.write(chunk)
        except aiohttp.ClientError as e:
            print(f"Виникла помилка при завантаженні файлу: {e}")

    async def download_segments(self, base_url, minutes, title):
        seconds = minutes * 60
        total_segments = seconds // 5

        async with aiohttp.ClientSession() as session:
            for i in range(1, total_segments + 1):
                url = f"{base_url}{i}.ts"
                save_path = os.path.join(os.getcwd(), 'media', title, f"segment{i}.ts")
                self.segments.append(f"segment{i}.ts")

                await self.download_file(session, url, save_path)

                # Оновлення прогресу
                self.percent_complete = ((i) / total_segments) * 100

                # Відправлення прогресу через WebSocket
                if self.websocket:
                    self.send_progress()

                print(f"\rЗавантаження: {self.percent_complete:.2f}%", end='')

        print("\nВсі сегменти успішно завантажені!")

    def send_progress(self):
        # Цей метод відправляє прогрес через WebSocket
        if self.websocket:
            self.websocket.send(json.dumps({'progress': self.percent_complete}))

    def generate_m3u8(self, name, target_duration=5):
        output_file = os.path.join(os.getcwd(), 'media', name, f'{name}.m3u8')
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        with open(output_file, 'w') as f:
            f.write('#EXTM3U\n')
            f.write('#EXT-X-VERSION:3\n')
            f.write(f'#EXT-X-TARGETDURATION:{target_duration}\n')
            f.write('#EXT-X-MEDIA-SEQUENCE:0\n')

            for segment in self.segments:
                f.write(f'#EXTINF:{target_duration}.0,\n')
                f.write(f'{segment}\n')

            f.write('#EXT-X-ENDLIST\n')

