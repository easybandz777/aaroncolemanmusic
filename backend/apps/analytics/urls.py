"""
URL configuration for analytics API.

This module defines URL patterns for analytics and visitor
tracking endpoints including statistics and reports.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Create router for API endpoints
router = DefaultRouter()

# URL patterns
urlpatterns = [
    # API endpoints
    path('', include(router.urls)),
    
    # Custom analytics endpoints can be added here
    # path('dashboard/', AnalyticsDashboardView.as_view(), name='dashboard'),
]

app_name = 'analytics' 