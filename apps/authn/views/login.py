import logging

from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html as HTML
from django.utils.safestring import mark_safe
from apps.users.models import User

from apps.authn.exceptions import AuthFailedError
from django.contrib.auth import authenticate
from django.contrib.auth import login as django_login
from django.http import JsonResponse

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from rest_framework import status
from rest_framework.views import APIView

from django.shortcuts import render, redirect

log = logging.getLogger(__name__)

def _log_and_raise_inactive_user_auth_error(unauthenticated_user):
    print("bkbsfkdjsdbkjb")
    raise AuthFailedError(
        _("Your account is inactive. Please activated by clicking the link provided in mail."),
        error_code="inactive-user"
    )

def _authenticate(request, unauthenticated_user):
    email = unauthenticated_user.email if unauthenticated_user else ""
    password = request.POST.get("password")
    return authenticate(email=email, password=password, request=request)

def _handle_failed_authentication(user):
    if user and not user.is_active:
        _log_and_raise_inactive_user_auth_error(user)

    raise AuthFailedError(
        _("Email or password is incorrect."),
        error_code="incorrect-email-or-password"
    )

def _handle_successful_authentication_and_login(user, request):
    try:
        django_login(request, user)
    except Exception as exc:
        log.exception(exc)
        raise

def _get_user_by_email(request):
    """
    Finds a user object in the database based on the given email, ignores all fields except for email.
    """
    try:
        email = request.POST.get("email", None)
        return User.objects.get(email=email)
    except User.DoesNotExist:
        return None
    

def login_user(request):
    user = _get_user_by_email(request)

    try:
        possibly_authenticated_user = _authenticate(request, user)

        if possibly_authenticated_user is None or not possibly_authenticated_user.is_active:
            _handle_failed_authentication(user)

        _handle_successful_authentication_and_login(possibly_authenticated_user, request)

        redirect_url = None

        response = JsonResponse(
            {
                "success": True,
                "redirect_url": redirect_url,
            }
        )

        return response
    except AuthFailedError as error:
        response_content = error.get_response()
        log.exception(response_content)

        email = request.POST.get('email', None)
        response_content["email"] = email
        response = JsonResponse(response_content, status=400)
        return response


class LoginSessionView(APIView):    
    @method_decorator(csrf_protect)
    def post(self, request):
        return login_user(request)
    
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
