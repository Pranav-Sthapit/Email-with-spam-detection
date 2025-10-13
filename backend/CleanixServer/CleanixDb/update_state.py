from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from . models import Mail,User


@api_view(["GET"])
def fetch_state(request,id):
    mail=Mail.objects.get(id=id)
    return Response({"starred":mail.starred,"archived":mail.archived})

@api_view(["PATCH"])
def update_state(request,id):
    mail=Mail.objects.get(id=id)
    mail.starred=request.data.get('starred')
    mail.archived=request.data.get('archived')
    mail.save()
    return Response({"message":"starred or archived state ok"})


@api_view(["GET"])
def set_trash(request,id):
    mail=Mail.objects.get(id=id)
    mail.starred=False
    mail.archived=False
    mail.trashed=True
    mail.save()
    return Response({"message":"trash state ok"})

@api_view(["GET"])
def restore_trash(request,id):
    mail=Mail.objects.get(id=id)
    mail.trashed=False
    mail.save()
    return Response({"message":"restore ok"})

@api_view(["GET"])
def set_permanent_delete(request,id):
    mail=Mail.objects.get(id=id)
    mail.starred=False
    mail.archived=False
    mail.trashed=False
    mail.permanent_delete=True
    mail.save()
    return Response({"message":"delete permanent ok"})

@api_view(["GET"])
def allow_spam(request,id):
    mail=Mail.objects.get(id=id)
    mail.spam=False
    mail.save()
    return Response({"message":"allow of spam ok"})

@api_view(["GET"])
def report_spam(request,id):
    mail=Mail.objects.get(id=id)
    #mark sender as increase spam count by 1 first
    sender_id=mail.sender.id
    sender=User.objects.get(id=sender_id)
    sender.spam_count+=1
    sender.save()

    mail.permanent_delete=True
    mail.save()
    return Response({"message":"report spam ok"})


