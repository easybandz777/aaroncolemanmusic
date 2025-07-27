"""
Content app configuration.

This module configures the content management application
including its display name and initialization settings.
"""

from django.apps import AppConfig


class ContentConfig(AppConfig):
    """Configuration for the content management app."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.content'
    verbose_name = 'Content Management'
    
    def ready(self):
        """Initialize app when Django starts."""
        # Import any signal handlers or initialization code here
        pass 