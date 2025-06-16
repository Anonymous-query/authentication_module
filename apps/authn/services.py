import secrets

import secrets
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from django.urls import reverse
from apps.authn.async_email import AsyncEmailSender
from django.db import transaction

User = get_user_model()

def send_welcome_email(user, activation_url):
    context = {
        "user": user,
        "activation_url": activation_url
    }

    AsyncEmailSender(
        subject="Welcome to Tracker System",
        to_email=user.email,
        template_name="emails/welcome_email.html",
        context=context
    ).start()


class RegistrationService:
    @staticmethod
    def register_email(request, user):
        activation_token = secrets.token_urlsafe(32)
        user.activation_token = activation_token
        user.save()

        activation_url = request.build_absolute_uri(
            reverse("activate_account", args=[activation_token])
        )

        subject = "Activate your account"
        message = f"""
Welcome {user.first_name},

To activate your account, click here:
{activation_url}

- Tracker System
"""
        print(message)
        send_welcome_email(user, activation_url)
        return True, None
