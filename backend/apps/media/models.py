"""
Media file management models.

This module handles file uploads, image processing, and media organization
for the CMS system including automatic compression and thumbnail generation.
"""

import os
from django.db import models
from django.contrib.auth.models import User
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill, ResizeToFit


class MediaCategory(models.Model):
    """Categories for organizing media files."""
    
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    
    # Display settings
    color = models.CharField(
        max_length=7,
        default='#007cba',
        help_text="Hex color code for category display"
    )
    icon = models.CharField(
        max_length=50,
        blank=True,
        help_text="CSS icon class for category"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Media Categories"
        ordering = ['name']
        
    def __str__(self):
        return self.name


class MediaFile(models.Model):
    """Base model for all uploaded media files."""
    
    FILE_TYPES = [
        ('image', 'Image'),
        ('document', 'Document'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('other', 'Other'),
    ]
    
    # Basic file information
    title = models.CharField(
        max_length=200,
        help_text="Descriptive title for this file"
    )
    description = models.TextField(
        blank=True,
        help_text="Optional description or caption"
    )
    
    # File details
    file = models.FileField(upload_to='uploads/%Y/%m/')
    file_type = models.CharField(
        max_length=20,
        choices=FILE_TYPES,
        help_text="Automatically detected file type"
    )
    file_size = models.PositiveIntegerField(
        help_text="File size in bytes"
    )
    mime_type = models.CharField(max_length=100)
    
    # Organization
    category = models.ForeignKey(
        MediaCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='files'
    )
    tags = models.CharField(
        max_length=500,
        blank=True,
        help_text="Comma-separated tags for searchability"
    )
    
    # SEO and accessibility
    alt_text = models.CharField(
        max_length=200,
        blank=True,
        help_text="Alt text for images (accessibility)"
    )
    caption = models.TextField(
        blank=True,
        help_text="Caption for display"
    )
    
    # Upload tracking
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='uploaded_files'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Usage tracking
    download_count = models.PositiveIntegerField(default=0)
    is_public = models.BooleanField(
        default=True,
        help_text="Allow public access to this file"
    )
    
    class Meta:
        ordering = ['-uploaded_at']
        
    def __str__(self):
        return self.title
    
    @property
    def file_extension(self):
        """Get file extension."""
        return os.path.splitext(self.file.name)[1].lower()
    
    @property
    def file_size_human(self):
        """Return human-readable file size."""
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024:
                return f"{size:.1f} {unit}"
            size /= 1024
        return f"{size:.1f} TB"
    
    @property
    def tag_list(self):
        """Return tags as a list."""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []
    
    def save(self, *args, **kwargs):
        """Set file_size and file_type on save."""
        if self.file:
            self.file_size = self.file.size
            
            # Determine file type from extension
            ext = self.file_extension
            if ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']:
                self.file_type = 'image'
            elif ext in ['.pdf', '.doc', '.docx', '.txt', '.rtf']:
                self.file_type = 'document'
            elif ext in ['.mp4', '.avi', '.mov', '.wmv', '.flv']:
                self.file_type = 'video'
            elif ext in ['.mp3', '.wav', '.flac', '.aac']:
                self.file_type = 'audio'
            else:
                self.file_type = 'other'
                
        super().save(*args, **kwargs)


class ImageFile(MediaFile):
    """Extended model specifically for image files with processing."""
    
    # Image-specific fields
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    
    # Generated thumbnails and versions
    thumbnail = ImageSpecField(
        source='file',
        processors=[ResizeToFill(300, 300)],
        format='JPEG',
        options={'quality': 85}
    )
    
    medium = ImageSpecField(
        source='file',
        processors=[ResizeToFit(800, 600)],
        format='JPEG',
        options={'quality': 90}
    )
    
    large = ImageSpecField(
        source='file',
        processors=[ResizeToFit(1200, 900)],
        format='JPEG',
        options={'quality': 95}
    )
    
    class Meta:
        verbose_name = "Image File"
        verbose_name_plural = "Image Files"
    
    @property
    def aspect_ratio(self):
        """Calculate image aspect ratio."""
        if self.width and self.height:
            return round(self.width / self.height, 2)
        return None
    
    @property
    def dimensions(self):
        """Return image dimensions as string."""
        if self.width and self.height:
            return f"{self.width} × {self.height}"
        return "Unknown"


class Gallery(models.Model):
    """Collections of images for organized display."""
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    
    # Gallery settings
    images = models.ManyToManyField(
        ImageFile,
        through='GalleryImage',
        related_name='galleries'
    )
    cover_image = models.ForeignKey(
        ImageFile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cover_for_galleries'
    )
    
    # Display options
    is_public = models.BooleanField(default=True)
    allow_download = models.BooleanField(default=True)
    
    # Metadata
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='galleries'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Galleries"
        ordering = ['-created_at']
        
    def __str__(self):
        return self.name
    
    @property
    def image_count(self):
        """Return number of images in gallery."""
        return self.images.count()


class GalleryImage(models.Model):
    """Through model for gallery-image relationship with ordering."""
    
    gallery = models.ForeignKey(Gallery, on_delete=models.CASCADE)
    image = models.ForeignKey(ImageFile, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    caption = models.TextField(blank=True)
    
    class Meta:
        ordering = ['order']
        unique_together = ['gallery', 'image']
        
    def __str__(self):
        return f"{self.gallery.name} - {self.image.title}" 