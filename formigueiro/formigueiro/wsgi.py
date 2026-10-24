"""WSGI config for formigueiro project."""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'formigueiro.settings')

application = get_wsgi_application()
