from django.urls import path
from .views import login, register, logout, account_activation

urlpatterns = [
    # Registration
    path('create_account', register.RegistrationView.as_view(), name='create_account'),

    path('login_ajax', login.login_user, name="login_api"),
    path("logout/",  logout.logout_user, name="logout"),

    path("activate/<str:token>/", account_activation.ActivateAccountView.as_view(), name="activate_account"),
]
