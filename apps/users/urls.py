from django.urls import path
from .views import login_view, register_view, about_page

urlpatterns = [
    path('login/', login_view, name='signin_user'),
    path('register/', register_view, name='register_user'),
    path("about/", about_page, name="about"),
]
