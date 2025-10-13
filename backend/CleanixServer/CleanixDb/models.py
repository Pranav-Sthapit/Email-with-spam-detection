from django.db import models
from django.utils import timezone


class Administrator(models.Model):
    username=models.CharField(max_length=50)
    password=models.CharField(max_length=50)

class Keys(models.Model):
    generator=models.CharField(default=("cleanixserver@gmail.com"))
    public_key=models.BigIntegerField(default=5)
    private_key=models.BigIntegerField(default=54461)
    N=models.BigIntegerField(default=136891)

class User(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.CharField(max_length=100, unique=True)  # unique constraint
    password = models.CharField(max_length=128)  # enough for hashed passwords
    photo= models.ImageField(upload_to='profile_photos/',null=True,blank=True)
    public_key = models.BigIntegerField()  # use BigIntegerField for large numbers
    N = models.BigIntegerField()
    spam_count=models.IntegerField(default=0)
    blocked=models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class Mail(models.Model):
    subject=models.CharField(max_length=100)
    message=models.TextField()
    sender=models.ForeignKey(User,on_delete=models.CASCADE,related_name="sent_mails")
    receiver=models.ForeignKey(User,on_delete=models.CASCADE,related_name="received_mails")
    date_time=models.DateTimeField(default=timezone.now)
    starred=models.BooleanField(default=False)
    archived=models.BooleanField(default=False)
    trashed=models.BooleanField(default=False)
    permanent_delete=models.BooleanField(default=False)
    spam=models.BooleanField(default=False)

    def __str__(self):
        return f"{self.subject} from {self.sender} to {self.receiver}"

class FileStorage(models.Model):
    file_path=models.FileField(upload_to="mail_attachments/")
    message=models.ForeignKey(Mail,on_delete=models.CASCADE,related_name="attachments")

    def __str__(self):
        return f"File for message {self.message.id}: {self.file_path.name}"
