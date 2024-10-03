from django.conf import settings
from django.http import HttpRequest
from django.utils.deprecation import MiddlewareMixin


class HeaderSubstituteMiddleware(MiddlewareMixin):
    def process_request(self, request: HttpRequest):
        if request.COOKIES.get('__clientid'):
            token = f"Bearer {request.COOKIES.get(settings.SIMPLE_JWT['AUTH_ACCESS_COOKIE'])}"
            request.META['HTTP_AUTHORIZATION'] = token

        if request.COOKIES.get('csrfmiddlewaretoken'):
            request.META['HTTP_X_CSRFTOKEN'] = request.COOKIES.get('csrfmiddlewaretoken')
