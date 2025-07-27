"""
Simple URL configuration for testing Django admin only
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse

def api_health(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'Django backend is running!',
        'admin_url': '/admin/',
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_health),
    path('api/health/', api_health),
] 