from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User

@api_view(["POST"])
def verify_exist(request):
    email=request.data.get("email")
    try:
        User.objects.get(email=email)
        return Response({"message":"user found","status":True})
    except User.DoesNotExist:
        return Response({"message":"User not found","status":False})

@api_view(["POST"])
def change_password(request):
    email=request.data.get("email")
    password=request.data.get("password")
    try:
        user=User.objects.get(email=email)
        user.password=password
        user.save()
        return Response({"message":"password change success"})
    except Exception as e:
        print(e)
        return Response({"message":"unable to change password"})
    