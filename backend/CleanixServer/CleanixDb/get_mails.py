from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User,Mail
from .serializers import MailSerializer
from .crypto import encrypt_string
@api_view(["GET"])
def get_mail(request,id,mail_type):
    user=User.objects.get(id=id)

    if mail_type.lower()=='inbox':
        mails=Mail.objects.filter(receiver=user,trashed=False,spam=False,permanent_delete=False).order_by("-date_time")
        for mail in mails:
            mail.person_detail=mail.sender

    elif mail_type.lower()=='starred':
        mails=Mail.objects.filter(receiver=user,starred=True,trashed=False,spam=False,permanent_delete=False).order_by("-date_time")
        for mail in mails:
            mail.person_detail=mail.sender

    elif mail_type.lower()=='archive':
        mails=Mail.objects.filter(receiver=user,archived=True,trashed=False,spam=False,permanent_delete=False).order_by("-date_time")
        for mail in mails:
            mail.person_detail=mail.sender

    elif mail_type.lower()=='trash':
        mails=Mail.objects.filter(receiver=user,trashed=True,spam=False,permanent_delete=False).order_by("-date_time")
        for mail in mails:
            mail.person_detail=mail.sender

    elif mail_type.lower()=='spam':
        mails=Mail.objects.filter(receiver=user,spam=True,permanent_delete=False).order_by("-date_time")
        for mail in mails:
            mail.person_detail=mail.sender

    elif mail_type.lower()=='sent':
        mails=Mail.objects.filter(sender=user).order_by("-date_time")
        for mail in mails:
            mail.person_detail=mail.receiver

    for mail in mails:
            mail.message=encrypt_string(mail.message,user.public_key,user.N)


    serializer=MailSerializer(mails,many=True,context={"request":request})
    data=serializer.data
     
    for mail in data:
        person=mail.pop("person_detail",{})
        for key,value in person.items():
            mail[key]=value
        
        attachments=mail.get("attachments",[])
        mail["file_path"]=[f.get("file_path") for f in attachments]
        mail.pop("attachments",None)
    return Response(data)

