from rest_framework import serializers
from .models import User,Mail,FileStorage

class UserSerializer(serializers.ModelSerializer):
    photo=serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = '__all__'  # include all fields: id, first_name, last_name, email, etc.

    def get_photo(self, obj):
        request = self.context.get("request")
        if obj.photo and request:
            return request.build_absolute_uri(obj.photo.url)  # FULL URL
        return None
    
class UserDetailSerializer(serializers.ModelSerializer):
    photo=serializers.SerializerMethodField()
    class Meta:
        model=User
        fields=['first_name','last_name','email','photo']

    def get_photo(self,obj):
        request = self.context.get("request")
        if obj.photo and request:
            return request.build_absolute_uri(obj.photo.url)  # FULL URL
        return None
    

class FileStorageSerializer(serializers.ModelSerializer):
    class Meta:
        model= FileStorage
        fields=['file_path',]

class MailSerializer(serializers.ModelSerializer):
    person_detail=UserDetailSerializer(read_only=True)
    attachments=FileStorageSerializer(many=True,read_only=True)
    class Meta:
        model= Mail
        fields='__all__'

