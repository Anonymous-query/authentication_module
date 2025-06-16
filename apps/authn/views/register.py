from django.shortcuts import render, redirect

import json
from apps.users.models import User
from django.db import IntegrityError, ProgrammingError, transaction
from apps.authn.exceptions import AccountValidationError
from django.conf import settings
from django.http import JsonResponse

from django.http import HttpResponseForbidden

from django.core.exceptions import PermissionDenied
from django.core.validators import ValidationError

from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.utils.translation import gettext as _
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
# from django_ratelimit.decorators import ratelimit
from apps.authn.services import RegistrationService

def email_exists(email):
    return User.objects.filter(email=email).exists()

def mobile_exists(mobile):
    return User.objects.filter(mobile=mobile).exists()

def create_account_with_params(params): 
    params = dict(list(params.items()))

    print(f"params: {params}")

    user = User(
        mobile=params.get('mobile'),
        email=params.get('email'),
        first_name=params.get('first_name'),
        last_name=params.get('last_name'),
        is_active=False
    )
    password = params.get('password')
    user.set_password(password)

    try:
        with transaction.atomic():
            user.save()
    except IntegrityError:
        if email_exists(user.email):
            raise AccountValidationError(  # lint-amnesty, pylint: disable=raise-missing-from
                _("An account with the Email '{email}' already exists.").format(email=user.email),
                field="email",
                error_code='duplicate-email',
            )
        elif mobile_exists(user.mobile):
            raise AccountValidationError(  # lint-amnesty, pylint: disable=raise-missing-from
                _("An account with the Email '{mobile}' already exists.").format(mobile=user.mobile),
                field="mobile",
                error_code='duplicate-mobile'
            )
        else:
            raise

    return user    


class RegistrationView(APIView):
    @method_decorator(transaction.non_atomic_requests)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    @method_decorator(csrf_exempt)
    #@method_decorator(ratelimit(key='ip', rate=settings.REGISTRATION_RATELIMIT, method='POST', block=False))
    def post(self, request):
        should_be_rate_limited = getattr(request, 'limited', False)
        if should_be_rate_limited:
            return JsonResponse({'error_code': 'forbidden-request'}, status=403)
        
        data = json.loads(request.body)

        response = self._handle_duplicate_email_mobile(request, data)
        if response:
            return response
        
        response, user = self._create_account(request, data)
        if response:
            return response
        
        redirect_url = ''
        authenticated_user = {'email': user.email, 'first_name': user.first_name, 'user_id': user.id}

        response = self._create_response(
            request, {'authenticated_user': authenticated_user}, status_code=200, redirect_url=redirect_url
        )

        return response
    
    def _handle_duplicate_email_mobile(self, request, data):
        email = data.get('email')
        mobile = data.get('mobile')
        errors = {}

        error_code = 'duplicate'

        if email is not None and email_exists(email):
            error_code += '-email'
            error_message = _("This email is already associated with an existing account")
            errors['email'] = {'user_message': error_message}

        if mobile is not None and mobile_exists(mobile):
            error_code += '-mobile'
            error_message = _("It looks like this mobile no. is already taken")
            errors['mobile'] = {'user_message': error_message}

        if errors:
            return self._create_response(request, errors, status_code=409, error_code=error_code)
        
    def _create_account(self, request, data):
        response, user = None, None

        try:
            user = create_account_with_params(data)
            RegistrationService.register_email(request, user)
        except AccountValidationError as err:
            errors = {
                err.field: [{"user_message": str(err)}]
            }

            response = self._create_response(request, errors, status_code=409, error_code=err.error_code)
        except ValidationError as err:
            error_code = err.message_dict.get('error_code', ['validation-error'])[0]
            errors = {
                field: [{"user_message": error} for error in error_list]
                for field, error_list in err.message_dict.items() if field != 'error_code'
            }
            response = self._create_response(request, errors, status_code=400, error_code=error_code)

        except PermissionDenied:
            response = HttpResponseForbidden(_("Account creation not allowed."))

        return response, user
    
    def _create_response(self, request, response_dict, status_code, redirect_url=None, error_code=None):
        if status_code == 200:
            # keeping this `success` field in for now, as we have outstanding clients expecting this
            response_dict['success'] = True
        if redirect_url:
            response_dict['redirect_url'] = redirect_url
        if error_code:
            response_dict['error_code'] = error_code
        return JsonResponse(response_dict, status=status_code)
    