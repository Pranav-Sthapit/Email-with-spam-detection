from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Keys


@api_view(["GET"])
def send_keys(request):
    key=Keys.objects.get(id=1)
    public_key=key.public_key
    N=key.N
    return Response({"publicKey":public_key,"N":N})