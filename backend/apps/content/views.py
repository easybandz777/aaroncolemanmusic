"""
Django REST Framework views for content management API.

This module provides both admin views (requiring authentication) and
public views for frontend consumption with proper filtering and pagination.
"""

from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from .models import ContentSection, Page, BlogPost, ContentBlock
from .serializers import (
    ContentSectionSerializer, PageSerializer, PageListSerializer,
    BlogPostSerializer, BlogPostListSerializer, ContentBlockSerializer,
    ContentBlockListSerializer, PublicPageSerializer, PublicBlogPostSerializer
)


class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit content.
    Read permissions are allowed for any request for public endpoints.
    """
    
    def has_permission(self, request, view):
        # Read permissions for any request on public views
        if view.action in ['list_public', 'retrieve_public', 'public']:
            return True
            
        # Write permissions only for admin users
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        return request.user and request.user.is_staff


class ContentSectionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing content sections."""
    
    queryset = ContentSection.objects.all()
    serializer_class = ContentSectionSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['section_type', 'is_active', 'show_in_nav']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'order', 'created_at']
    ordering = ['order', 'name']
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def public(self, request):
        """Get active sections for public navigation."""
        sections = self.queryset.filter(is_active=True, show_in_nav=True)
        serializer = self.get_serializer(sections, many=True)
        return Response(serializer.data)


class PageViewSet(viewsets.ModelViewSet):
    """ViewSet for managing pages."""
    
    queryset = Page.objects.select_related('author', 'section').all()
    permission_classes = [IsAdminUserOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'section', 'author', 'requires_auth']
    search_fields = ['title', 'content', 'meta_title', 'slug']
    ordering_fields = ['title', 'created_at', 'updated_at', 'published_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return PageListSerializer
        elif self.action in ['retrieve_public', 'list_public']:
            return PublicPageSerializer
        return PageSerializer
    
    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = self.queryset
        
        # For public endpoints, only show published pages
        if self.action in ['retrieve_public', 'list_public']:
            queryset = queryset.filter(status='published')
            
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def list_public(self, request):
        """List published pages for public consumption."""
        queryset = self.get_queryset().filter(status='published')
        
        # Filter by section if provided
        section_slug = request.query_params.get('section')
        if section_slug:
            queryset = queryset.filter(section__slug=section_slug)
            
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny],
            url_path='public', lookup_field='slug')
    def retrieve_public(self, request, slug=None):
        """Retrieve a published page by slug for public consumption."""
        try:
            page = self.get_queryset().get(slug=slug, status='published')
            serializer = self.get_serializer(page)
            return Response(serializer.data)
        except Page.DoesNotExist:
            return Response(
                {'error': 'Page not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate a page with a new title and slug."""
        page = self.get_object()
        
        # Create a copy with modified title
        new_title = f"{page.title} (Copy)"
        new_page = Page.objects.create(
            title=new_title,
            content=page.content,
            excerpt=page.excerpt,
            section=page.section,
            template_name=page.template_name,
            author=request.user,
            status='draft',
            # Copy SEO fields
            meta_title=page.meta_title,
            meta_description=page.meta_description,
            robots_txt=page.robots_txt,
        )
        
        serializer = self.get_serializer(new_page)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BlogPostViewSet(viewsets.ModelViewSet):
    """ViewSet for managing blog posts."""
    
    queryset = BlogPost.objects.select_related('author').all()
    permission_classes = [IsAdminUserOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'author', 'is_featured', 'allow_comments']
    search_fields = ['title', 'content', 'tags', 'meta_title', 'slug']
    ordering_fields = ['title', 'created_at', 'updated_at', 'published_at']
    ordering = ['-published_at', '-created_at']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return BlogPostListSerializer
        elif self.action in ['retrieve_public', 'list_public']:
            return PublicBlogPostSerializer
        return BlogPostSerializer
    
    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = self.queryset
        
        # For public endpoints, only show published posts
        if self.action in ['retrieve_public', 'list_public']:
            queryset = queryset.filter(
                status='published',
                published_at__lte=timezone.now()
            )
            
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def list_public(self, request):
        """List published blog posts for public consumption."""
        queryset = self.get_queryset()
        
        # Filter by category
        category = request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
            
        # Filter by tags
        tags = request.query_params.get('tags')
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            for tag in tag_list:
                queryset = queryset.filter(tags__icontains=tag)
        
        # Filter featured posts
        featured = request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
            
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny],
            url_path='public', lookup_field='slug')
    def retrieve_public(self, request, slug=None):
        """Retrieve a published blog post by slug for public consumption."""
        try:
            post = self.get_queryset().get(
                slug=slug, 
                status='published',
                published_at__lte=timezone.now()
            )
            serializer = self.get_serializer(post)
            return Response(serializer.data)
        except BlogPost.DoesNotExist:
            return Response(
                {'error': 'Blog post not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def categories(self, request):
        """Get list of all blog post categories."""
        categories = BlogPost.objects.filter(
            status='published'
        ).values_list('category', flat=True).distinct()
        
        # Remove empty categories and return as list
        categories = [cat for cat in categories if cat]
        return Response({'categories': categories})
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def tags(self, request):
        """Get list of all blog post tags."""
        posts = BlogPost.objects.filter(status='published').values_list('tags', flat=True)
        
        # Extract and deduplicate tags
        all_tags = set()
        for tag_string in posts:
            if tag_string:
                tags = [tag.strip() for tag in tag_string.split(',')]
                all_tags.update(tags)
                
        return Response({'tags': sorted(list(all_tags))})
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate a blog post with a new title and slug."""
        post = self.get_object()
        
        # Create a copy with modified title
        new_title = f"{post.title} (Copy)"
        new_post = BlogPost.objects.create(
            title=new_title,
            content=post.content,
            excerpt=post.excerpt,
            category=post.category,
            tags=post.tags,
            author=request.user,
            status='draft',
            allow_comments=post.allow_comments,
            read_time_minutes=post.read_time_minutes,
            # Copy SEO fields
            meta_title=post.meta_title,
            meta_description=post.meta_description,
            robots_txt=post.robots_txt,
        )
        
        serializer = self.get_serializer(new_post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ContentBlockViewSet(viewsets.ModelViewSet):
    """ViewSet for managing content blocks."""
    
    queryset = ContentBlock.objects.all()
    permission_classes = [IsAdminUserOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['block_type', 'is_active']
    search_fields = ['name', 'title', 'content']
    ordering_fields = ['name', 'created_at', 'updated_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return ContentBlockListSerializer
        return ContentBlockSerializer
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def public(self, request):
        """Get active content blocks for public consumption."""
        blocks = self.queryset.filter(is_active=True)
        
        # Filter by block type if provided
        block_type = request.query_params.get('type')
        if block_type:
            blocks = blocks.filter(block_type=block_type)
            
        # Filter by identifier if provided
        identifier = request.query_params.get('identifier')
        if identifier:
            blocks = blocks.filter(identifier=identifier)
            
        serializer = ContentBlockSerializer(blocks, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny],
            url_path='public', lookup_field='identifier')
    def retrieve_public(self, request, identifier=None):
        """Retrieve a content block by identifier for public consumption."""
        try:
            block = self.queryset.get(identifier=identifier, is_active=True)
            serializer = ContentBlockSerializer(block, context={'request': request})
            return Response(serializer.data)
        except ContentBlock.DoesNotExist:
            return Response(
                {'error': 'Content block not found'}, 
                status=status.HTTP_404_NOT_FOUND
            ) 