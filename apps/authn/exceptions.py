""" User Authn related Exceptions. """


from django.utils.safestring import mark_safe


class AuthFailedError(Exception):
    """
    This is a helper for the login view, allowing the various sub-methods to error out with an appropriate failure
    message.
    """
    def __init__(  # lint-amnesty, pylint: disable=dangerous-default-value
        self, value=None, redirect=None, redirect_url=None, error_code=None, context={},
    ):
        super().__init__()
        self.value = mark_safe(value)
        self.redirect = redirect
        self.redirect_url = redirect_url
        self.error_code = error_code
        self.context = context

    def get_response(self):
        """ Returns a dict representation of the error. """
        resp = {'success': False}
        for attr in ('value', 'redirect', 'redirect_url', 'error_code', 'context'):
            if getattr(self, attr):
                resp[attr] = getattr(self, attr)

        return resp

class AccountValidationError(Exception):
    def __init__(self, message, field, error_code=None):
        super().__init__(message)
        self.field = field
        self.error_code = error_code