from django.urls import path
from .consumers import WSConsumer


ws_urlpatterns = [
    path('ws/progress/', WSConsumer.as_asgi())
]