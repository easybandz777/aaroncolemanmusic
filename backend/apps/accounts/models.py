"""
User accounts and authentication models.

This module extends Django's built-in User model with additional
profile information and authentication-related functionality.
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class UserProfile(models.Model):
    """Extended user profile with additional information."""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    
    # Profile information
    bio = models.TextField(
        max_length=500, 
        blank=True,
        help_text="Brief biography or description"
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        help_text="Profile picture"
    )
    
    # Contact information
    phone = models.CharField(
        max_length=20,
        blank=True,
        help_text="Phone number"
    )
    website = models.URLField(
        blank=True,
        help_text="Personal or professional website"
    )
    
    # Preferences
    email_notifications = models.BooleanField(
        default=True,
        help_text="Receive email notifications"
    )
    newsletter_subscription = models.BooleanField(
        default=False,
        help_text="Subscribe to newsletter updates"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"
        
    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    @property
    def full_name(self):
        """Return user's full name or username if not available."""
        if self.user.first_name and self.user.last_name:
            return f"{self.user.first_name} {self.user.last_name}"
        return self.user.username


class LoginSession(models.Model):
    """Track user login sessions for security and analytics."""
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='login_sessions'
    )
    
    # Session information
    session_key = models.CharField(max_length=40, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    
    # Location data (optional)
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    
    # Session lifecycle
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-last_activity']
        verbose_name = "Login Session"
        verbose_name_plural = "Login Sessions"
        
    def __str__(self):
        return f"{self.user.username} - {self.created_at}"
    
    @property
    def duration(self):
        """Calculate session duration."""
        if self.is_active:
            return timezone.now() - self.created_at
        return self.last_activity - self.created_at


class PasswordResetRequest(models.Model):
    """Track password reset requests for security monitoring."""
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='password_reset_requests'
    )
    
    # Request details
    token = models.CharField(max_length=100, unique=True)
    ip_address = models.GenericIPAddressField()
    requested_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(blank=True, null=True)
    is_used = models.BooleanField(default=False)
    
    # Expiration
    expires_at = models.DateTimeField()
    
    class Meta:
        ordering = ['-requested_at']
        verbose_name = "Password Reset Request"
        verbose_name_plural = "Password Reset Requests"
        
    def __str__(self):
        return f"Reset request for {self.user.username}"
    
    @property
    def is_expired(self):
        """Check if the reset token has expired."""
        return timezone.now() > self.expires_at
    
    @property
    def is_valid(self):
        """Check if the reset token is still valid."""
        return not self.is_used and not self.is_expired 