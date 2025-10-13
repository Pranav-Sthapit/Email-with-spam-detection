from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User,Mail,FileStorage,Keys
from ml.spam_detector_function import combined_spam_result
import json
from .crypto import decrypt_string

def store_files(mail_instance,file_path):
    if hasattr(file_path, "read"):  # It's a Django uploaded file
        FileStorage.objects.create(message=mail_instance, file_path=file_path)
    else:  
        FileStorage.objects.create(message=mail_instance, file_path=file_path)


def store_message(message,subject,sender_id,receiver_id,files,spam):
    sender=User.objects.get(id=sender_id)
    receiver=User.objects.get(id=receiver_id)

    mail_instance=Mail.objects.create(
        message=message,
        subject=subject,
        sender=sender,
        receiver=receiver,
        spam=spam
    )

    for file in files:
        store_files(mail_instance,file)



@api_view(["POST"])
def put_send_mail(request):

    sender_id=int(request.data.get("userId"))
    to=request.data.get("to")
    cc=json.loads(request.data.get("cc"))
    subject=request.data.get("subject")
    encrypted_message = request.data.get("message")  # e.g., "112450,112450,40354,1318,..."
    encrypted_array = [int(x) for x in encrypted_message.split(',')]
    message = decrypt_string(
        encrypted_array,
        Keys.objects.get(id=1).private_key,
        Keys.objects.get(id=1).N
        )

    uploaded_files = request.FILES.getlist("attachments")
    forwarded_paths = json.loads(request.data.get("file_paths", "[]"))

    files = uploaded_files + forwarded_paths

    #check if main receiver exists
    try:
        receiver=User.objects.get(email=to)
    except User.DoesNotExist:
        return Response({"message":f"Recipient {to} not registered"})
    
    if receiver.id==sender_id:
        return Response({"message":"cannot send to self"})

    #check if cc exist
    available_cc=[]
    unavailable_cc=[]

    for email in cc:
        try:
            user=User.objects.get(email=email)
            available_cc.append(user.id)
        except User.DoesNotExist:
            unavailable_cc.append(email)

    _from=User.objects.get(id=sender_id).email
    spam=combined_spam_result(_from,available_cc,subject,message)


    store_message(message,subject,sender_id,receiver.id,files,spam)
    response_data={"message":"Message sent successfully"}

    if sender_id in available_cc:
        response_data["message"]+=" but cannot CC to self"
        available_cc.remove(sender_id)

    for id in available_cc:
        store_message(message,subject,sender_id,id,files,spam)

    if unavailable_cc:
        response_data["message"]+=" and some mails are not available"
        response_data["unregistered_cc"]=unavailable_cc

    return Response(response_data)

