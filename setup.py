#!/usr/bin/env python3
"""
Development setup script for Full-Stack CMS

This script automates the initial setup process for the CMS project.
Run this after cloning the repository to set up your development environment.

Usage:
    python setup.py

Requirements:
    - Python 3.8+
    - Node.js 16+
    - PostgreSQL (optional, SQLite used as fallback)
"""

import os
import sys
import subprocess
import platform
from pathlib import Path


def run_command(cmd: str, cwd: str | None = None, shell: bool = True) -> bool:
    """Run a shell command and return success status."""
    try:
        print(f"Running: {cmd}")
        result = subprocess.run(
            cmd, 
            shell=shell, 
            cwd=cwd, 
            check=True,
            capture_output=True,
            text=True
        )
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {cmd}")
        print(f"Error: {e.stderr}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False


def check_requirements():
    """Check if required software is installed."""
    print("Checking system requirements...")
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("Error: Python 3.8+ is required")
        return False
    print(f"✓ Python {sys.version.split()[0]}")
    
    # Check Node.js
    try:
        result = subprocess.run(
            ["node", "--version"], capture_output=True, text=True
        )
        print(f"✓ Node.js {result.stdout.strip()}")
    except FileNotFoundError:
        print("Error: Node.js is not installed")
        return False
    
    # Check npm
    try:
        result = subprocess.run(
            ["npm", "--version"], capture_output=True, text=True
        )
        print(f"✓ npm {result.stdout.strip()}")
    except FileNotFoundError:
        print("Error: npm is not installed")
        return False
    
    return True


def setup_backend():
    """Set up the Django backend."""
    print("\n=== Setting up Backend ===")
    
    backend_dir = Path("backend")
    
    if not backend_dir.exists():
        print("Backend directory not found. Run from project root.")
        return False
    
    # Create virtual environment
    venv_path = backend_dir / "venv"
    if not venv_path.exists():
        print("Creating virtual environment...")
        if not run_command(f"python -m venv {venv_path}"):
            return False
    
    # Determine script paths based on OS
    if platform.system() == "Windows":
        pip_path = venv_path / "Scripts" / "pip"
        python_path = venv_path / "Scripts" / "python"
    else:
        pip_path = venv_path / "bin" / "pip"
        python_path = venv_path / "bin" / "python"
    
    # Install requirements
    print("Installing Python dependencies...")
    requirements_file = backend_dir / "requirements.txt"
    if requirements_file.exists():
        cmd = f"{pip_path} install -r requirements.txt"
        if not run_command(cmd, cwd=str(backend_dir)):
            return False
    else:
        print("requirements.txt not found, skipping installation")
    
    # Copy environment file
    env_example = Path("env.example")
    env_file = backend_dir / ".env"
    if env_example.exists() and not env_file.exists():
        print("Creating .env file from template...")
        import shutil
        shutil.copy(env_example, env_file)
    
    # Run migrations
    print("Running database migrations...")
    manage_py = backend_dir / "manage.py"
    if manage_py.exists():
        if not run_command(f"{python_path} manage.py migrate", cwd=str(backend_dir)):
            print("Warning: Migration failed. You may need to set up the database manually.")
    
    return True


def setup_frontend():
    """Set up the Next.js frontend."""
    print("\n=== Setting up Frontend ===")
    
    frontend_dir = Path("frontend")
    
    if not frontend_dir.exists():
        print("Frontend directory not found. This script should be run from the project root.")
        return False
    
    # Install npm dependencies
    print("Installing Node.js dependencies...")
    package_json = frontend_dir / "package.json"
    if package_json.exists():
        if not run_command("npm install", cwd=str(frontend_dir)):
            return False
    else:
        print("package.json not found, skipping dependency installation")
    
    return True


def create_admin_user():
    """Create default admin user for development."""
    print("\n=== Creating Admin User ===")
    
    backend_dir = Path("backend")
    
    # Determine Python path based on OS
    if platform.system() == "Windows":
        python_path = backend_dir / "venv" / "Scripts" / "python"
    else:
        python_path = backend_dir / "venv" / "bin" / "python"
    
    manage_py = backend_dir / "manage.py"
    if manage_py.exists():
        # Create superuser script
        create_user_script = """
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Admin user created: username=admin, password=admin123')
else:
    print('Admin user already exists')
"""
        
        script_file = backend_dir / "create_admin.py"
        with open(script_file, "w") as f:
            f.write(create_user_script)
        
        try:
            run_command(f"{python_path} manage.py shell < create_admin.py", cwd=str(backend_dir))
            os.remove(script_file)
        except Exception:
            print("Warning: Could not create admin user automatically")
            if script_file.exists():
                os.remove(script_file)


def main():
    """Main setup function."""
    print("Full-Stack CMS Development Setup")
    print("=" * 40)
    
    if not check_requirements():
        print("\nSetup failed. Please install missing requirements and try again.")
        sys.exit(1)
    
    if not setup_backend():
        print("\nBackend setup failed.")
        sys.exit(1)
    
    if not setup_frontend():
        print("\nFrontend setup failed.")
        sys.exit(1)
    
    create_admin_user()
    
    print("\n" + "=" * 40)
    print("Setup completed successfully!")
    print("\nNext steps:")
    print("1. cd backend && source venv/bin/activate && python manage.py runserver")
    print("2. In another terminal: cd frontend && npm run dev")
    print("3. Visit http://localhost:3000 for the public site")
    print("4. Visit http://localhost:3000/admin for the admin panel")
    print("5. Use admin/admin123 to log in")
    print("\nHappy coding!")


if __name__ == "__main__":
    main() 