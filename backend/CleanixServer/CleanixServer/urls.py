"""
URL configuration for CleanixServer project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from CleanixDb import views
from CleanixDb import user_info,forget
from CleanixDb import send_mail,get_mails,update_state,send_keys,change_info,admin_operations
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/',views.register,name="register"),
    path('login/',views.login,name='login'),
    path('user_info/',user_info.get_user_info,name="get_user_info"),
    path('send_mail/',send_mail.put_send_mail,name="send_mail"),
    path('get_mail/<int:id>/<str:mail_type>',get_mails.get_mail,name="get_mail"),
    path('update_state/<int:id>/',update_state.update_state,name="update_state"),
    path('fetch_state/<int:id>/',update_state.fetch_state,name='fetch_state'),
    path('set_trash/<int:id>/',update_state.set_trash,name="set_trash"),
    path('restore_trash/<int:id>/',update_state.restore_trash,name="restore_trash"),
    path('set_permanent_delete/<int:id>/',update_state.set_permanent_delete,name="set_permanent_delete"),
    path('allow_spam/<int:id>/',update_state.allow_spam,name="allow_spam"),
    path('report_spam/<int:id>/',update_state.report_spam,name="report_spam"),
    path('send_keys/',send_keys.send_keys,name="send_keys"),
    path('change_info/',change_info.change_info,name="change_info"),
    path('verify_exist/',forget.verify_exist,name="verify_exist"),
    path('forget_password/',forget.change_password,name="change_passsword"),
    path('admin_view/get_users/',admin_operations.get_users,name="get_users"),
    path('admin_view/block_unblock_user/',admin_operations.block_unblock_user,name="block_unblock_user"),
    path('admin_view/get_user_mails/',admin_operations.get_user_mails,name="get_user_mails"),
    path('admin_view/get_mail_detail/<int:id>/',admin_operations.get_mail_detail,name="get_mail_detail"),
    path('admin_view/get_generator/',admin_operations.get_generator,name="get_generator"),
    path('admin_view/set_generator/',admin_operations.set_generator,name="set_generator"),
    path('admin_view/login/',admin_operations.login,name="admin_login"),
]
 
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)