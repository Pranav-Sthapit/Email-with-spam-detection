from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer

def get_user_data(user_id, fields=None):
    try:
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        data = serializer.data
        if fields:
            # return only selected fields
            return {field: data[field] for field in fields if field in data}
        return data
    except User.DoesNotExist:
        return None



@api_view(["POST"])
def get_user_info(request):
    user_id=request.data.get("userId")
    fields=request.data.get('fields',None)

    try:
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user,context={"request":request})
        data=serializer.data

        if fields:
            data={field:data[field] for field in fields if field in data}
            
        return Response({"user": data}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"message": "No user found"}, status=status.HTTP_404_NOT_FOUND)
