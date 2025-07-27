"""
URL configuration for media management API.

This module defines URL patterns for media file management
including upload, categorization, and gallery endpoints.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Create router for API endpoints
router = DefaultRouter()

# URL patterns
urlpatterns = [
    # API endpoints
    path('', include(router.urls)),
    
    # Custom media endpoints can be added here
    # path('upload/', MediaUploadView.as_view(), name='upload'),
]

app_name = 'media' 