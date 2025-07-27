"""
Analytics and visitor tracking models.

This module provides basic visitor analytics including page views,
visitor sessions, and performance metrics for the CMS.
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class VisitorSession(models.Model):
    """Track visitor sessions for analytics."""
    
    # Session identification
    session_key = models.CharField(max_length=40, unique=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='visitor_sessions'
    )
    
    # Technical information
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    
    # Browser and device info
    browser_name = models.CharField(max_length=100, blank=True)
    browser_version = models.CharField(max_length=50, blank=True)
    device_type = models.CharField(
        max_length=20,
        choices=[
            ('desktop', 'Desktop'),
            ('tablet', 'Tablet'),
            ('mobile', 'Mobile'),
            ('bot', 'Bot'),
        ],
        default='desktop'
    )
    operating_system = models.CharField(max_length=100, blank=True)
    
    # Geographic information (basic)
    country = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    
    # Referrer information
    referrer_url = models.URLField(blank=True, max_length=500)
    referrer_domain = models.CharField(max_length=255, blank=True)
    utm_source = models.CharField(max_length=100, blank=True)
    utm_medium = models.CharField(max_length=100, blank=True)
    utm_campaign = models.CharField(max_length=100, blank=True)
    
    # Session lifecycle
    started_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(default=timezone.now)
    ended_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-started_at']
        
    def __str__(self):
        user_info = self.user.username if self.user else "Anonymous"
        return f"Session: {user_info} - {self.started_at}"
    
    @property
    def duration(self):
        """Calculate session duration."""
        end_time = self.ended_at or timezone.now()
        return end_time - self.started_at
    
    @property
    def is_authenticated_user(self):
        """Check if session belongs to authenticated user."""
        return self.user is not None


class PageView(models.Model):
    """Track individual page views for analytics."""
    
    # Page information
    url = models.URLField(max_length=500)
    page_title = models.CharField(max_length=200, blank=True)
    
    # Content tracking (for CMS content)
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Session and user tracking
    session = models.ForeignKey(
        VisitorSession,
        on_delete=models.CASCADE,
        related_name='page_views'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='page_views'
    )
    
    # View details
    viewed_at = models.DateTimeField(auto_now_add=True)
    time_on_page = models.DurationField(null=True, blank=True)
    
    # Technical details
    response_time = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Page load time in milliseconds"
    )
    status_code = models.PositiveIntegerField(default=200)
    
    # Engagement metrics
    scroll_depth = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Maximum scroll depth as percentage"
    )
    
    class Meta:
        ordering = ['-viewed_at']
        
    def __str__(self):
        return f"{self.url} - {self.viewed_at}"


class PopularContent(models.Model):
    """Aggregated popular content statistics."""
    
    # Content reference
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Statistics
    total_views = models.PositiveIntegerField(default=0)
    unique_visitors = models.PositiveIntegerField(default=0)
    avg_time_on_page = models.DurationField(null=True, blank=True)
    
    # Time periods
    views_today = models.PositiveIntegerField(default=0)
    views_this_week = models.PositiveIntegerField(default=0)
    views_this_month = models.PositiveIntegerField(default=0)
    
    # Metadata
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['content_type', 'object_id']
        ordering = ['-total_views']
        
    def __str__(self):
        return f"Stats: {self.content_object} ({self.total_views} views)"


class TrafficSource(models.Model):
    """Track traffic sources and referrers."""
    
    SOURCE_TYPES = [
        ('direct', 'Direct'),
        ('search', 'Search Engine'),
        ('social', 'Social Media'),
        ('referral', 'Referral'),
        ('email', 'Email'),
        ('paid', 'Paid Advertising'),
        ('other', 'Other'),
    ]
    
    # Source information
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPES)
    source_name = models.CharField(
        max_length=100,
        help_text="e.g., 'Google', 'Facebook', 'twitter.com'"
    )
    
    # Statistics
    total_sessions = models.PositiveIntegerField(default=0)
    total_pageviews = models.PositiveIntegerField(default=0)
    avg_session_duration = models.DurationField(null=True, blank=True)
    bounce_rate = models.FloatField(
        null=True,
        blank=True,
        help_text="Percentage of single-page sessions"
    )
    
    # Time tracking
    first_seen = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['source_type', 'source_name']
        ordering = ['-total_sessions']
        
    def __str__(self):
        return f"{self.get_source_type_display()}: {self.source_name}"


class DailySummary(models.Model):
    """Daily aggregated analytics summary."""
    
    # Date
    date = models.DateField(unique=True)
    
    # Traffic metrics
    total_pageviews = models.PositiveIntegerField(default=0)
    unique_visitors = models.PositiveIntegerField(default=0)
    new_visitors = models.PositiveIntegerField(default=0)
    returning_visitors = models.PositiveIntegerField(default=0)
    
    # Engagement metrics
    avg_session_duration = models.DurationField(null=True, blank=True)
    avg_pages_per_session = models.FloatField(null=True, blank=True)
    bounce_rate = models.FloatField(null=True, blank=True)
    
    # Top content
    most_viewed_page = models.URLField(blank=True, max_length=500)
    most_viewed_page_views = models.PositiveIntegerField(default=0)
    
    # Technical metrics
    avg_page_load_time = models.FloatField(
        null=True,
        blank=True,
        help_text="Average page load time in seconds"
    )
    
    # Generated timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
        verbose_name_plural = "Daily Summaries"
        
    def __str__(self):
        return f"Analytics: {self.date} ({self.total_pageviews} views)" 