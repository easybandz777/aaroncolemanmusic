"""
URL configuration for accounts API.

This module defines URL patterns for user account management
and authentication-related endpoints.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Create router for API endpoints
router = DefaultRouter()

# URL patterns
urlpatterns = [
    # API endpoints
    path('', include(router.urls)),
    
    # Custom authentication endpoints can be added here
    # path('profile/', UserProfileView.as_view(), name='profile'),
]

app_name = 'accounts' 