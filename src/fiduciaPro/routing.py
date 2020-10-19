from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import UserApp.routing

application = ProtocolTypeRouter({
    # Empty for now (http->django views is added by default)
    'websocket' :  AuthMiddlewareStack(
        URLRouter(
            UserApp.routing.websocket_urlpatterns
        )
    ),
})