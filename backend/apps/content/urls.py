"""
URL configuration for content management API.

This module defines all the URL patterns for content-related API endpoints
including both admin and public endpoints with proper routing.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ContentSectionViewSet,
    PageViewSet,
    BlogPostViewSet,
    ContentBlockViewSet
)

# Create router for API endpoints
router = DefaultRouter()
router.register(r'sections', ContentSectionViewSet, basename='section')
router.register(r'pages', PageViewSet, basename='page')
router.register(r'blog', BlogPostViewSet, basename='blogpost')
router.register(r'blocks', ContentBlockViewSet, basename='contentblock')

# URL patterns
urlpatterns = [
    # API endpoints
    path('', include(router.urls)),
]

# Custom URL patterns for specific endpoints
app_name = 'content' 