"""
Content models for CMS application.

This module defines the core content models including pages, blog posts,
sections, and content blocks that power the CMS functionality.

Models:
- ContentSection: Organizes content into sections (Home, About, Blog, etc.)
- Page: Static pages with SEO features
- BlogPost: Blog articles with rich content
- ContentBlock: Reusable content components
- SEOSettings: Search engine optimization metadata
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.urls import reverse
from ckeditor.fields import RichTextField
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill


class TimestampedModel(models.Model):
    """Abstract base model with timestamp fields."""
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class SEOSettings(TimestampedModel):
    """SEO metadata for pages and content."""
    
    # Primary SEO fields
    meta_title = models.CharField(
        max_length=70, 
        help_text="Page title for search engines (recommended: 50-60 chars)"
    )
    meta_description = models.TextField(
        max_length=160,
        help_text="Meta description for search results (150-160 chars)"
    )
    
    # Additional SEO fields
    canonical_url = models.URLField(
        blank=True, 
        help_text="Canonical URL to prevent duplicate content issues"
    )
    og_title = models.CharField(
        max_length=95, 
        blank=True,
        help_text="Open Graph title for social media sharing"
    )
    og_description = models.TextField(
        max_length=300, 
        blank=True,
        help_text="Open Graph description for social media"
    )
    og_image = models.ImageField(
        upload_to='seo/og_images/', 
        blank=True,
        help_text="Open Graph image (recommended: 1200x630px)"
    )
    
    # Technical SEO
    robots_txt = models.CharField(
        max_length=50,
        default='index, follow',
        help_text="Robots meta tag instructions"
    )
    structured_data = models.JSONField(
        blank=True, 
        null=True,
        help_text="JSON-LD structured data for rich snippets"
    )
    
    class Meta:
        abstract = True
        
    def __str__(self):
        return self.meta_title or "SEO Settings"


class ContentSection(TimestampedModel):
    """Content sections for organizing the website structure."""
    
    SECTION_TYPES = [
        ('home', 'Home'),
        ('about', 'About'),
        ('services', 'Services'),
        ('blog', 'Blog'),
        ('contact', 'Contact'),
        ('custom', 'Custom Section'),
    ]
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=100)
    section_type = models.CharField(max_length=20, choices=SECTION_TYPES)
    description = models.TextField(
        blank=True,
        help_text="Internal description of this section"
    )
    
    # Display settings
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this section appears in navigation"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Order in navigation menu"
    )
    
    # Navigation settings
    show_in_nav = models.BooleanField(
        default=True,
        help_text="Display in main navigation"
    )
    nav_title = models.CharField(
        max_length=50,
        blank=True,
        help_text="Title shown in navigation (defaults to name)"
    )
    
    class Meta:
        ordering = ['order', 'name']
        
    def save(self, *args, **kwargs):
        """Auto-generate slug from name if not provided."""
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.name
    
    @property
    def display_name(self):
        """Return nav_title if set, otherwise name."""
        return self.nav_title or self.name


class Page(SEOSettings):
    """Static pages with full content management."""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    # Basic page information
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='draft'
    )
    
    # Content
    content = RichTextField(
        help_text="Main page content with rich text formatting"
    )
    excerpt = models.TextField(
        blank=True,
        max_length=500,
        help_text="Brief excerpt for previews and summaries"
    )
    
    # Featured image
    featured_image = models.ImageField(
        upload_to='pages/featured/', 
        blank=True,
        help_text="Main image for the page"
    )
    featured_image_thumbnail = ImageSpecField(
        source='featured_image',
        processors=[ResizeToFill(400, 300)],
        format='JPEG',
        options={'quality': 85}
    )
    
    # Page settings
    section = models.ForeignKey(
        ContentSection,
        on_delete=models.CASCADE,
        related_name='pages'
    )
    template_name = models.CharField(
        max_length=100,
        default='default',
        help_text="Template to use for rendering this page"
    )
    
    # Publishing
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='authored_pages'
    )
    published_at = models.DateTimeField(blank=True, null=True)
    
    # Advanced settings
    requires_auth = models.BooleanField(
        default=False,
        help_text="Require user authentication to view this page"
    )
    custom_css = models.TextField(
        blank=True,
        help_text="Custom CSS specific to this page"
    )
    custom_js = models.TextField(
        blank=True,
        help_text="Custom JavaScript specific to this page"
    )
    
    class Meta:
        ordering = ['-created_at']
        
    def save(self, *args, **kwargs):
        """Auto-generate slug and handle publishing timestamp."""
        if not self.slug:
            self.slug = slugify(self.title)
            
        # Set published_at when status changes to published
        if self.status == 'published' and not self.published_at:
            from django.utils import timezone
            self.published_at = timezone.now()
            
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        """Return the canonical URL for this page."""
        return reverse('page_detail', kwargs={'slug': self.slug})
    
    @property
    def is_published(self):
        """Check if page is published."""
        return self.status == 'published'


class BlogPost(SEOSettings):
    """Blog posts with advanced content management."""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('scheduled', 'Scheduled'),
        ('archived', 'Archived'),
    ]
    
    # Basic post information
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='draft'
    )
    
    # Content
    content = RichTextField(
        help_text="Main blog post content with rich formatting"
    )
    excerpt = models.TextField(
        blank=True,
        max_length=500,
        help_text="Brief excerpt for blog previews and RSS feeds"
    )
    
    # Featured image
    featured_image = models.ImageField(
        upload_to='blog/featured/', 
        blank=True,
        help_text="Featured image for the blog post"
    )
    featured_image_thumbnail = ImageSpecField(
        source='featured_image',
        processors=[ResizeToFill(600, 400)],
        format='JPEG',
        options={'quality': 85}
    )
    
    # Categorization
    tags = models.CharField(
        max_length=500,
        blank=True,
        help_text="Comma-separated tags for this post"
    )
    category = models.CharField(
        max_length=100,
        blank=True,
        help_text="Primary category for this post"
    )
    
    # Publishing
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='blog_posts'
    )
    published_at = models.DateTimeField(blank=True, null=True)
    scheduled_for = models.DateTimeField(
        blank=True, 
        null=True,
        help_text="Schedule this post for future publication"
    )
    
    # Engagement settings
    allow_comments = models.BooleanField(
        default=True,
        help_text="Allow comments on this blog post"
    )
    is_featured = models.BooleanField(
        default=False,
        help_text="Feature this post on the homepage"
    )
    
    # Reading statistics
    read_time_minutes = models.PositiveIntegerField(
        default=5,
        help_text="Estimated reading time in minutes"
    )
    
    class Meta:
        ordering = ['-published_at', '-created_at']
        
    def save(self, *args, **kwargs):
        """Auto-generate slug and handle publishing logic."""
        if not self.slug:
            self.slug = slugify(self.title)
            
        # Handle status changes
        if self.status == 'published' and not self.published_at:
            from django.utils import timezone
            self.published_at = timezone.now()
            
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        """Return the canonical URL for this blog post."""
        return reverse('blog_post_detail', kwargs={'slug': self.slug})
    
    @property
    def is_published(self):
        """Check if post is published."""
        return self.status == 'published'
    
    @property
    def tag_list(self):
        """Return tags as a list."""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []


class ContentBlock(TimestampedModel):
    """Reusable content blocks for pages and posts."""
    
    BLOCK_TYPES = [
        ('text', 'Text Block'),
        ('image', 'Image Block'),
        ('video', 'Video Block'),
        ('gallery', 'Image Gallery'),
        ('testimonial', 'Testimonial'),
        ('cta', 'Call to Action'),
        ('custom', 'Custom HTML'),
    ]
    
    name = models.CharField(
        max_length=100,
        help_text="Internal name for this content block"
    )
    block_type = models.CharField(max_length=20, choices=BLOCK_TYPES)
    identifier = models.SlugField(
        unique=True,
        help_text="Unique identifier for referencing this block"
    )
    
    # Content
    title = models.CharField(max_length=200, blank=True)
    content = RichTextField(blank=True)
    image = models.ImageField(upload_to='blocks/', blank=True)
    url = models.URLField(blank=True, help_text="Link URL for CTAs")
    button_text = models.CharField(
        max_length=50, 
        blank=True,
        help_text="Button text for CTAs"
    )
    
    # Display settings
    is_active = models.BooleanField(default=True)
    css_classes = models.CharField(
        max_length=200,
        blank=True,
        help_text="Additional CSS classes for styling"
    )
    
    # Usage tracking
    pages = models.ManyToManyField(
        Page,
        blank=True,
        related_name='content_blocks'
    )
    
    class Meta:
        ordering = ['name']
        
    def save(self, *args, **kwargs):
        """Auto-generate identifier from name if not provided."""
        if not self.identifier:
            self.identifier = slugify(self.name)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.name} ({self.get_block_type_display()})" 