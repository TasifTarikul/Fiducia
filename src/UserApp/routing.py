from .consumers import NotificationConsumer
from django.urls import re_path


websocket_urlpatterns = [
    re_path(r'ws/user_app/notify/(?P<userid>[0-9]+)/$', NotificationConsumer)
]
