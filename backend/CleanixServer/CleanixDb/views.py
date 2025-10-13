from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from . models import User
from . serializers import UserSerializer

@api_view(['POST'])
def register(request):
    data = {
        "first_name": request.data.get("firstName"),
        "last_name": request.data.get("lastName"),
        "email": request.data.get("email"),
        "password": request.data.get("password"),
        "public_key": int(request.data.get("publicKey", 0)),
        "N": int(request.data.get("N", 0)),
    }

    # Only add photo if it exists
    if "photo" in request.FILES:
        data["photo"] = request.FILES["photo"]

    serializer=UserSerializer(data=data)
    if serializer.is_valid():
        user=serializer.save()
        return Response({"message":"User registration success","result":True,"userId":user.id})
    else:
        return Response({"message": "User registration failed please choose another email","result":False})

@api_view(['POST'])
def login(request):
    email=request.data.get("email")
    password=request.data.get("password")

    try:
        user=User.objects.get(email=email,password=password)
        user.public_key=int(request.data.get("publicKey"))
        user.N=int(request.data.get("N"))
        user.save()
        if user.blocked==True:
            return Response({"message":"You have been blocked due to repeated spam mails","result":False})
        return Response({"message":"Login Success","result":True,"userId":user.id})
    except User.DoesNotExist:
        return Response({"message": "Invalid email or password", "result": False})





