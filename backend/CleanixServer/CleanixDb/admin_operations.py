from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User,Mail,Keys,Administrator
from .serializers import MailSerializer,UserSerializer

@api_view(["POST"])
def block_unblock_user(request):
    id=int(request.data.get("id"))
    user=User.objects.get(id=id)
    user.blocked=not user.blocked
    user.save()
    if user.blocked:
        return Response({"message":"user blocked"})
    else:
        return Response({"message":"user unblocked"})

@api_view(["POST"])
def get_user_mails(request):
    id=int(request.data.get("id"))
    user=User.objects.get(id=id)
    mail=Mail.objects.filter(sender=user)
    serialize=MailSerializer(mail,many=True)
    return Response(serialize.data)

@api_view(["GET"])
def get_users(request):
    users=User.objects.all()
    serializer=UserSerializer(users,many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_mail_detail(request, id):
    try:
        mail = Mail.objects.get(id=id)
    except Mail.DoesNotExist:
        return Response({"error": "Mail not found"})

    serializer = MailSerializer(mail)
    data = serializer.data

    # Simplify sender and receiver
    if mail.sender:
        data['sender'] = {
            "first_name": mail.sender.first_name,
            "last_name": mail.sender.last_name,
            "email": mail.sender.email,
            "id":mail.sender.id,
        }
    else:
        data['sender'] = None

    if mail.receiver:
        data['receiver'] = {
            "first_name": mail.receiver.first_name,
            "last_name": mail.receiver.last_name,
            "email": mail.receiver.email,
            "id":mail.receiver.id,
        }
    else:
        data['receiver'] = None

    return Response(data)


@api_view(["GET"])
def get_generator(request):
    unique_string=Keys.objects.get(id=1).generator
    return Response({"unique_string":unique_string})

@api_view(["POST"])
def set_generator(request):
    key_detail=Keys.objects.get(id=1)
    key_detail.generator=request.data.get("generator")
    key_detail.public_key=int(request.data.get("publicKey"))
    key_detail.private_key=int(request.data.get("privateKey"))
    key_detail.N=int(request.data.get("N"))
    key_detail.save()
    return Response({"message":"key saved"})


@api_view(['POST'])
def login(request):
    username=request.data.get("username")
    password=request.data.get("password")
    try:
        Administrator.objects.get(username=username,password=password)
        return Response({"message":"Login Success","result":True})
    except Administrator.DoesNotExist:
        return Response({"message": "Invalid username or password", "result": False})
