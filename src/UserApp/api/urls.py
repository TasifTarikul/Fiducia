from rest_framework import routers
from .views import UserViewSet, OrderViewSet, JourneyViewSet, JourneyOrderViewset
from django.urls import path, include


app_name = 'UserProfileApi'

router = routers.DefaultRouter()
router.register('userinfo', UserViewSet, basename='user_api')
router.register('order', OrderViewSet, basename='order_api')
router.register('journey', JourneyViewSet, basename='journey_api')
router.register('journey_order', JourneyOrderViewset, basename='journey_order_api')

urlpatterns = [
    path('', include((router.urls, 'user'), namespace='user_api'))

]
