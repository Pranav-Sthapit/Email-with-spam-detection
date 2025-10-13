from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
@api_view(["POST"])
def change_info(request):
    id=int(request.data.get("id"))
    fname=request.data.get("first_name")
    lname=request.data.get("last_name")
    password=request.data.get("password")

    user=User.objects.get(id=id)
    user.first_name=fname
    user.last_name=lname
    user.password=password

    if "photo" in request.FILES:
        user.photo=request.FILES["photo"]
    else:
        if user.photo:
            user.photo.delete(save=False)
        user.photo=None

    user.save()

    return Response({"message":"Info changed successfully"})
