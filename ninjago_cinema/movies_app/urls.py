from django.urls import path, include
from . import views
from rest_framework import routers
from .views import MovieAPIView, UserAPIView
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'movie', MovieAPIView, basename='movie')
router.register(r'user', UserAPIView, basename='user')


urlpatterns = [
    path('', views.home, name='home'),
    path('movies/', views.movies, name='movies'),
    path('download_segments/', views.preparing_for_loading_segments, name='download_segments'),
    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)