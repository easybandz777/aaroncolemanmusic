# Full-Stack Admin-Editable Website

A modern, scalable content management system with Django backend and Next.js frontend.

## Features

- **Admin Panel**: Intuitive dashboard for non-technical users
- **Content Management**: Create/edit pages, blog posts, and media
- **Rich Text Editor**: Full WYSIWYG editing capabilities
- **Image Management**: Upload, compress, and organize media files
- **SEO Optimization**: Editable meta tags and slug-based routing
- **Analytics**: Basic visitor tracking and insights
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Secure Authentication**: JWT-based admin authentication

## Tech Stack

### Backend
- **Framework**: Django 4.2+ with Django REST Framework
- **Database**: PostgreSQL 14+
- **Authentication**: JWT tokens
- **Media Storage**: Local with auto-compression
- **API**: RESTful endpoints

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI + custom components
- **Rich Text**: TinyMCE editor
- **State Management**: React Context + SWR for data fetching

## Project Structure

```
project/
├── backend/          # Django backend
│   ├── core/         # Main Django project
│   ├── apps/         # Django applications
│   ├── requirements.txt
│   └── manage.py
├── frontend/         # Next.js frontend
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   ├── package.json
│   └── next.config.js
├── .env.example      # Environment variables template
└── setup.py          # Development setup script
```

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd project
   python setup.py
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Public Site: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - API: http://localhost:8000/api/

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

> **Important**: Change these credentials in production!

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Django
SECRET_KEY=your-secret-key-here
DEBUG=True

# JWT
JWT_SECRET_KEY=your-jwt-secret

# Media
MEDIA_ROOT=/path/to/media
MEDIA_URL=/media/

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deployment

### Vercel (Frontend)
The frontend is ready for Vercel deployment with included `vercel.json`.

### Render/Heroku (Backend)
The backend includes production settings and requirements for cloud deployment.

## License

MIT License 