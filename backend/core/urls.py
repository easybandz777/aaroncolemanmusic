"""
Main URL configuration for CMS project.

This module defines all the URL patterns for the application,
including API endpoints, admin interface, and media serving.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# API URL patterns
api_patterns = [
    # Authentication endpoints
    path(
        'auth/login/', 
        TokenObtainPairView.as_view(), 
        name='token_obtain_pair'
    ),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Application API endpoints
    path('accounts/', include('apps.accounts.urls')),
    path('content/', include('apps.content.urls')),
    path('media/', include('apps.media.urls')),
    path('analytics/', include('apps.analytics.urls')),
]

# Main URL patterns
urlpatterns = [
    # Django admin interface
    path('django-admin/', admin.site.urls),
    
    # API endpoints
    path('api/v1/', include(api_patterns)),
    
    # CKEditor for rich text editing
    path('ckeditor/', include('ckeditor_uploader.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, 
        document_root=settings.MEDIA_ROOT
    )
    urlpatterns += static(
        settings.STATIC_URL, 
        document_root=settings.STATIC_ROOT
    )

# Configure admin interface
admin.site.site_header = "CMS Administration"
admin.site.site_title = "CMS Admin Portal"
admin.site.index_title = "Welcome to CMS Administration" 