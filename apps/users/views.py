from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

def login_view(request):
    if request.user.is_authenticated:
        return redirect('about')
    return render(request, 'users/login.html')

def register_view(request):
    if request.user.is_authenticated:
        return redirect('about')
    return render(request, 'users/register.html')


@login_required(login_url='/login/')  # redirect to your login URL if unauthenticated
def about_page(request):
    return render(request, "about-page.html")
