"""
Django admin configuration for content management.

This module provides a user-friendly admin interface for managing
content including pages, blog posts, sections, and content blocks.
All admin interfaces are optimized for non-technical users.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import ContentSection, Page, BlogPost, ContentBlock


@admin.register(ContentSection)
class ContentSectionAdmin(admin.ModelAdmin):
    """Admin interface for content sections."""
    
    list_display = [
        'name', 
        'section_type', 
        'is_active', 
        'show_in_nav', 
        'order',
        'page_count',
        'created_at'
    ]
    list_filter = ['section_type', 'is_active', 'show_in_nav']
    search_fields = ['name', 'description']
    list_editable = ['is_active', 'show_in_nav', 'order']
    ordering = ['order', 'name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'section_type', 'description')
        }),
        ('Display Settings', {
            'fields': ('is_active', 'order')
        }),
        ('Navigation Settings', {
            'fields': ('show_in_nav', 'nav_title')
        }),
    )
    
    prepopulated_fields = {'slug': ('name',)}
    
    def page_count(self, obj):
        """Display number of pages in this section."""
        count = obj.pages.count()
        if count > 0:
            url = reverse('admin:content_page_changelist')
            return format_html(
                '<a href="{}?section__id__exact={}">{} pages</a>',
                url, obj.id, count
            )
        return '0 pages'
    
    page_count.short_description = 'Pages'


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    """Admin interface for static pages."""
    
    list_display = [
        'title',
        'section',
        'status',
        'author',
        'is_published',
        'published_at',
        'view_on_site_link',
        'updated_at'
    ]
    list_filter = [
        'status',
        'section',
        'author',
        'created_at',
        'requires_auth'
    ]
    search_fields = ['title', 'content', 'meta_title']
    list_editable = ['status']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'section', 'status', 'author')
        }),
        ('Content', {
            'fields': ('excerpt', 'content', 'featured_image'),
            'classes': ['wide']
        }),
        ('SEO Settings', {
            'fields': (
                'meta_title',
                'meta_description',
                'canonical_url',
                'robots_txt'
            ),
            'classes': ['collapse']
        }),
        ('Social Media', {
            'fields': ('og_title', 'og_description', 'og_image'),
            'classes': ['collapse']
        }),
        ('Advanced Settings', {
            'fields': (
                'template_name',
                'requires_auth',
                'custom_css',
                'custom_js'
            ),
            'classes': ['collapse']
        }),
        ('Publishing', {
            'fields': ('published_at',),
            'classes': ['collapse']
        }),
    )
    
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['published_at']
    
    def is_published(self, obj):
        """Display publication status with visual indicator."""
        if obj.status == 'published':
            return format_html(
                '<span style="color: green;">✓ Published</span>'
            )
        elif obj.status == 'draft':
            return format_html(
                '<span style="color: orange;">📝 Draft</span>'
            )
        else:
            return format_html(
                '<span style="color: red;">📁 Archived</span>'
            )
    
    is_published.short_description = 'Status'
    
    def view_on_site_link(self, obj):
        """Provide link to view page on public site."""
        if obj.status == 'published':
            url = obj.get_absolute_url()
            return format_html(
                '<a href="{}" target="_blank">View Live</a>',
                url
            )
        return '-'
    
    view_on_site_link.short_description = 'View'
    
    def save_model(self, request, obj, form, change):
        """Set author to current user if not set."""
        if not obj.author_id:
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    """Admin interface for blog posts."""
    
    list_display = [
        'title',
        'category',
        'status',
        'author',
        'is_featured',
        'read_time_minutes',
        'published_at',
        'view_on_site_link',
        'updated_at'
    ]
    list_filter = [
        'status',
        'category',
        'author',
        'is_featured',
        'allow_comments',
        'created_at'
    ]
    search_fields = ['title', 'content', 'tags', 'meta_title']
    list_editable = ['status', 'is_featured', 'category']
    date_hierarchy = 'published_at'
    ordering = ['-published_at', '-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'status', 'author')
        }),
        ('Content', {
            'fields': ('excerpt', 'content', 'featured_image'),
            'classes': ['wide']
        }),
        ('Categorization', {
            'fields': ('category', 'tags')
        }),
        ('Publishing Settings', {
            'fields': (
                'published_at',
                'scheduled_for',
                'is_featured',
                'allow_comments',
                'read_time_minutes'
            )
        }),
        ('SEO Settings', {
            'fields': (
                'meta_title',
                'meta_description',
                'canonical_url',
                'robots_txt'
            ),
            'classes': ['collapse']
        }),
        ('Social Media', {
            'fields': ('og_title', 'og_description', 'og_image'),
            'classes': ['collapse']
        }),
    )
    
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['published_at']
    
    def view_on_site_link(self, obj):
        """Provide link to view blog post on public site."""
        if obj.status == 'published':
            url = obj.get_absolute_url()
            return format_html(
                '<a href="{}" target="_blank">View Live</a>',
                url
            )
        return '-'
    
    view_on_site_link.short_description = 'View'
    
    def save_model(self, request, obj, form, change):
        """Set author to current user if not set."""
        if not obj.author_id:
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(ContentBlock)
class ContentBlockAdmin(admin.ModelAdmin):
    """Admin interface for reusable content blocks."""
    
    list_display = [
        'name',
        'block_type',
        'is_active',
        'usage_count',
        'created_at'
    ]
    list_filter = ['block_type', 'is_active']
    search_fields = ['name', 'title', 'content']
    list_editable = ['is_active']
    ordering = ['name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'identifier', 'block_type', 'is_active')
        }),
        ('Content', {
            'fields': ('title', 'content', 'image'),
            'classes': ['wide']
        }),
        ('Call to Action Settings', {
            'fields': ('url', 'button_text'),
            'description': 'Only used for Call to Action blocks'
        }),
        ('Display Settings', {
            'fields': ('css_classes',)
        }),
        ('Usage', {
            'fields': ('pages',),
            'classes': ['collapse']
        }),
    )
    
    prepopulated_fields = {'identifier': ('name',)}
    filter_horizontal = ['pages']
    
    def usage_count(self, obj):
        """Display how many pages use this content block."""
        count = obj.pages.count()
        if count > 0:
            return format_html(
                '<span style="color: green;">{} pages</span>',
                count
            )
        return format_html(
            '<span style="color: gray;">Unused</span>'
        )
    
    usage_count.short_description = 'Used in'


# Customize admin site headers
admin.site.site_header = "CMS Administration"
admin.site.site_title = "CMS Admin"
admin.site.index_title = "Content Management System" 