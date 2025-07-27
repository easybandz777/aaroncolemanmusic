"""
Django REST Framework serializers for content management.

This module provides serializers for all content models including
pages, blog posts, sections, and content blocks with proper
validation and nested relationships.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ContentSection, Page, BlogPost, ContentBlock


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user information in content responses."""
    
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'full_name']
        
    def get_full_name(self, obj):
        """Get user's full name or username."""
        if obj.first_name and obj.last_name:
            return f"{obj.first_name} {obj.last_name}"
        return obj.username


class ContentSectionSerializer(serializers.ModelSerializer):
    """Serializer for content sections."""
    
    page_count = serializers.SerializerMethodField()
    display_name = serializers.ReadOnlyField()
    
    class Meta:
        model = ContentSection
        fields = [
            'id', 'name', 'slug', 'section_type', 'description',
            'is_active', 'order', 'show_in_nav', 'nav_title',
            'display_name', 'page_count', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'slug': {'required': False}  # Auto-generated if not provided
        }
        
    def get_page_count(self, obj):
        """Get number of pages in this section."""
        return obj.pages.count()


class ContentSectionListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for section listings."""
    
    display_name = serializers.ReadOnlyField()
    
    class Meta:
        model = ContentSection
        fields = ['id', 'name', 'display_name', 'slug', 'section_type']


class PageSerializer(serializers.ModelSerializer):
    """Serializer for page management."""
    
    author = UserSerializer(read_only=True)
    section = ContentSectionListSerializer(read_only=True)
    section_id = serializers.IntegerField(write_only=True)
    is_published = serializers.ReadOnlyField()
    featured_image_url = serializers.SerializerMethodField()
    absolute_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Page
        fields = [
            'id', 'title', 'slug', 'status', 'content', 'excerpt',
            'featured_image', 'featured_image_url', 'section', 'section_id',
            'template_name', 'author', 'published_at', 'requires_auth',
            'custom_css', 'custom_js', 'is_published', 'absolute_url',
            # SEO fields
            'meta_title', 'meta_description', 'canonical_url', 'robots_txt',
            'og_title', 'og_description', 'og_image',
            # Timestamps
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'slug': {'required': False},
            'author': {'read_only': True}
        }
        
    def get_featured_image_url(self, obj):
        """Get featured image URL."""
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None
        
    def get_absolute_url(self, obj):
        """Get absolute URL for the page."""
        try:
            return obj.get_absolute_url()
        except Exception:
            return f"/page/{obj.slug}/"
        
    def create(self, validated_data):
        """Create page with current user as author."""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['author'] = request.user
        return super().create(validated_data)


class PageListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for page listings."""
    
    author = UserSerializer(read_only=True)
    section = ContentSectionListSerializer(read_only=True)
    is_published = serializers.ReadOnlyField()
    
    class Meta:
        model = Page
        fields = [
            'id', 'title', 'slug', 'status', 'excerpt',
            'section', 'author', 'is_published',
            'published_at', 'updated_at'
        ]


class BlogPostSerializer(serializers.ModelSerializer):
    """Serializer for blog post management."""
    
    author = UserSerializer(read_only=True)
    is_published = serializers.ReadOnlyField()
    tag_list = serializers.ReadOnlyField()
    featured_image_url = serializers.SerializerMethodField()
    absolute_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'status', 'content', 'excerpt',
            'featured_image', 'featured_image_url', 'tags', 'tag_list',
            'category', 'author', 'published_at', 'scheduled_for',
            'allow_comments', 'is_featured', 'read_time_minutes',
            'is_published', 'absolute_url',
            # SEO fields
            'meta_title', 'meta_description', 'canonical_url', 'robots_txt',
            'og_title', 'og_description', 'og_image',
            # Timestamps
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'slug': {'required': False},
            'author': {'read_only': True}
        }
        
    def get_featured_image_url(self, obj):
        """Get featured image URL."""
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None
        
    def get_absolute_url(self, obj):
        """Get absolute URL for the blog post."""
        try:
            return obj.get_absolute_url()
        except Exception:
            return f"/blog/{obj.slug}/"
        
    def create(self, validated_data):
        """Create blog post with current user as author."""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['author'] = request.user
        return super().create(validated_data)


class BlogPostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for blog post listings."""
    
    author = UserSerializer(read_only=True)
    is_published = serializers.ReadOnlyField()
    tag_list = serializers.ReadOnlyField()
    featured_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'status', 'excerpt',
            'featured_image_url', 'category', 'tag_list',
            'author', 'is_published', 'is_featured',
            'read_time_minutes', 'published_at', 'updated_at'
        ]
        
    def get_featured_image_url(self, obj):
        """Get featured image URL."""
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None


class ContentBlockSerializer(serializers.ModelSerializer):
    """Serializer for content blocks."""
    
    image_url = serializers.SerializerMethodField()
    usage_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ContentBlock
        fields = [
            'id', 'name', 'block_type', 'identifier', 'title',
            'content', 'image', 'image_url', 'url', 'button_text',
            'is_active', 'css_classes', 'usage_count',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'identifier': {'required': False}
        }
        
    def get_image_url(self, obj):
        """Get image URL."""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
        
    def get_usage_count(self, obj):
        """Get usage count for this content block."""
        return obj.pages.count()


class ContentBlockListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for content block listings."""
    
    usage_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ContentBlock
        fields = [
            'id', 'name', 'block_type', 'identifier',
            'is_active', 'usage_count', 'created_at'
        ]
        
    def get_usage_count(self, obj):
        """Get usage count for this content block."""
        return obj.pages.count()


# Public serializers for frontend consumption
class PublicPageSerializer(serializers.ModelSerializer):
    """Public serializer for pages (frontend consumption)."""
    
    section = ContentSectionListSerializer(read_only=True)
    featured_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Page
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt',
            'featured_image_url', 'section', 'meta_title',
            'meta_description', 'og_title', 'og_description',
            'published_at', 'updated_at'
        ]
        
    def get_featured_image_url(self, obj):
        """Get featured image URL."""
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None


class PublicBlogPostSerializer(serializers.ModelSerializer):
    """Public serializer for blog posts (frontend consumption)."""
    
    author = UserSerializer(read_only=True)
    tag_list = serializers.ReadOnlyField()
    featured_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt',
            'featured_image_url', 'category', 'tag_list',
            'author', 'read_time_minutes', 'meta_title',
            'meta_description', 'og_title', 'og_description',
            'published_at', 'updated_at'
        ]
        
    def get_featured_image_url(self, obj):
        """Get featured image URL."""
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None 