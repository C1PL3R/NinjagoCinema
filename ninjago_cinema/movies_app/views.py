import json
import asyncio

from django.shortcuts import render
from .serializer import MovieSerializer, UserSerializer
from rest_framework import viewsets
from .models import Movie, User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .download_segments import SegmentsAndProgress


def index(request):
    return render(request, 'index.html')

def movies(request):
    return render(request, 'movies.html')


class MovieAPIView(viewsets.ModelViewSet):
    queryset = Movie.objects.all()  
    serializer_class = MovieSerializer
    
class UserAPIView(viewsets.ModelViewSet):
    queryset = User.objects.all()  
    serializer_class = UserSerializer
    
@csrf_exempt
def preparing_for_loading_segments(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get('title')
            base_url = data.get('url_for_segments')
            minutes = int(data.get('minutes'))

            SaP = SegmentsAndProgress()
            
            asyncio.run(SaP.download_segments(
                base_url=base_url,
                minutes=minutes,
                title=title
            ))

            SaP.generate_m3u8(title)
            return JsonResponse({'status': 'success'})
        except json.JSONDecodeError:
            return JsonResponse({'status': 'fail', 'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'fail', 'error': str(e)}, status=500)
    return JsonResponse({'status': 'fail', 'error': 'Invalid HTTP method'}, status=405)