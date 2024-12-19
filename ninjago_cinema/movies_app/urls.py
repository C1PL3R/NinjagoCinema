from django.urls import path, include
from . import views
from rest_framework import routers
from .views import MovieAPIView, UserAPIView
from django.shortcuts import redirect, render
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'movie', MovieAPIView, basename='movie')
router.register(r'user', UserAPIView, basename='user')


urlpatterns = [
    path('', views.index, name='home'),
    path('movies/', views.movies, name='movies'),
    path('download_segments/', views.preparing_for_loading_segments, name='download_segments'),
    path('api/', include(router.urls)),
    path('start.html', lambda request: render(request, 'start.html'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)