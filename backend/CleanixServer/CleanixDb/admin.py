from django.contrib import admin
from .models import User,Mail,FileStorage,Keys,Administrator
# Register your models here.

admin.site.register(User)
admin.site.register(Mail)
admin.site.register(FileStorage)
admin.site.register(Keys)
admin.site.register(Administrator)
