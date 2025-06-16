from django.contrib.auth import logout
from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.http import require_POST

def logout_user(request):
    if request.user.is_authenticated:
        logout(request)
        # For AJAX requests
        if request.headers.get("x-requested-with") == "XMLHttpRequest":
            return JsonResponse({"message": "Successfully logged out"}, status=200)
        # For regular POST form submission
        return redirect("signin_user")  # replace with your login URL name
    return JsonResponse({"error": "User not authenticated"}, status=400)
