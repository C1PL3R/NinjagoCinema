# import os
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# from movies_app.routing import ws_urlpatterns

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ninjago_cinema.settings')

# application = ProtocolTypeRouter({
#     'http': get_asgi_application(),
#     'websocket': AuthMiddlewareStack(URLRouter(ws_urlpatterns)),
# })
"""
ASGI config for ninjago_cinema project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ninjago_cinema.settings')

application = get_asgi_application()
