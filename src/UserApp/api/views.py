from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import UserSerializer, OrderSerializer, JourneySerializer, JourneyOrderSerializer
from ..models import Order, User, Journey, JourneyOrder
from django.db.models import Q
import time


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    @action(detail=False)
    def current_completed_order(self, request):
        start = time.process_time()
        user = request.user
        all_current_orders = self.get_queryset().filter(Q(orderer=user), ~Q(order_status='received'))
        all_complete_orders = self.get_queryset().filter(Q(orderer=user), Q(order_status='received'))
        all_current_orders_serializer = self.serializer_class(all_current_orders, many=True)
        all_complete_orders_serializer = self.serializer_class(all_complete_orders, many=True)

        return Response({'current_orders': all_current_orders_serializer.data,
                         'completed_orders': all_complete_orders_serializer.data,
                         })

    def list(self, request, *args, **kwargs):
        all_self_orders = self.get_queryset().filter(Q(order_status='awaiting'), Q(order_type='selfpacked'))
        all_cyberproduct_orders = self.get_queryset().filter(Q(order_status='awaiting'), Q(order_type='cybershop'))
        all_self_orders_serializer = self.serializer_class(all_self_orders, many=True)
        all_cyberproduct_orders_orders_serializer = self.serializer_class(all_cyberproduct_orders, many=True)
        return Response({
            'selfpacked':all_self_orders_serializer.data,
            'cybershop': all_cyberproduct_orders_orders_serializer.data
        })


class JourneyViewSet(viewsets.ModelViewSet):
    serializer_class = JourneySerializer
    queryset = Journey.objects.all()

    @action(detail=False)
    def current_completed_journey(self, request):
        user = request.user
        all_current_journey = self.get_queryset().filter(Q(traveller=user), Q(journey_status='active'))
        all_complete_journey = self.get_queryset().filter(Q(traveller=user), Q(journey_status='complete'))

        all_current_journey_serializer = self.serializer_class(all_current_journey, many=True)
        all_complete_journey_serializer = self.serializer_class(all_complete_journey, many=True)

        return Response({
            'current_journey': all_current_journey_serializer.data,
            'completed_journey': all_complete_journey_serializer.data
        })


class JourneyOrderViewset(viewsets.ModelViewSet):
    serializer_class = JourneyOrderSerializer
    queryset = JourneyOrder.objects.all()

