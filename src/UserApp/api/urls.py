from rest_framework import routers
from .views import UserViewSet, OrderViewSet, JourneyViewSet, JourneyOrderViewset, \
    create_journey_order, NegotiateViewset, on_success_payment
from django.urls import path, include


app_name = 'UserProfileApi'

router = routers.DefaultRouter()
router.register('userinfo', UserViewSet, basename='user_api')
router.register('order', OrderViewSet, basename='order_api')
router.register('journey', JourneyViewSet, basename='journey_api')
router.register('journey_order', JourneyOrderViewset, basename='journey_order_api')
router.register('negotiate', NegotiateViewset, basename='negotiate_api')

urlpatterns = [
    path('', include((router.urls, 'user'), namespace='user_api')),
    path('create-journey-order', create_journey_order, name='create_journey_order'),
    path('on_success_payment/<str:journey_order_id>', on_success_payment, name='on_success_payment')
]
