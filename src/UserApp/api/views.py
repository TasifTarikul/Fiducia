from rest_framework import viewsets
from rest_framework.decorators import action, api_view

from rest_framework.response import Response
from .serializers import UserSerializer, OrderSerializer, JourneySerializer, JourneyOrderSerializer, NegotiateSerializer
from ..models import Order, User, Journey, JourneyOrder, Negotiate
from django.db.models import Q
import time
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import redirect
import uuid


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    @action(detail=False)
    def current_completed_order(self, request):
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
        all_complete_journey = self.get_queryset().filter(Q(traveller=user), Q(journey_status='completed'))

        all_current_journey_serializer = self.serializer_class(all_current_journey, many=True)
        all_complete_journey_serializer = self.serializer_class(all_complete_journey, many=True)

        return Response({
            'current_journey': all_current_journey_serializer.data,
            'completed_journey': all_complete_journey_serializer.data
        })


class JourneyOrderViewset(viewsets.ModelViewSet):
    serializer_class = JourneyOrderSerializer
    queryset = JourneyOrder.objects.all()


class NegotiateViewset(viewsets.ModelViewSet):
    serializer_class = NegotiateSerializer
    queryset = Negotiate

    # over written to redierct to order list page
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return HttpResponseRedirect(reverse('UserApp:all_orders'))

    def perform_create(self, serializer):
        serializer.save()


@api_view(['POST'])
def create_journey_order(request):
    if request.method == 'POST':
        print(request.POST)
        if 'Accept' in request.POST:
            journey = Journey.objects.get(pk=int(request.POST['journey']))
            order = Order.objects.get(pk=uuid.UUID(request.POST['order']).hex)
            i = JourneyOrder(order=order, journey=journey,
                             accepted_order_status='active')
            order.order_status = 'accepted'
            order.journey = journey
            order.delivery_price = int(request.POST['delivery_price'])
            order.save()
            i.save()
            # if accept button is pressed by orderer or negotiator
            if 'negotiation_status' in request.POST:
                negotiation = Negotiate.objects.get(pk=int(request.POST['negotiation_id']))
                negotiation.negotiation_status = request.POST['negotiation_status']
                negotiation.save()
                # turn all active negotiators to rejected
                m = order.negotiates.exclude(id=request.POST['negotiation_id']).filter(negotiation_status='active')
                for e in m:
                    e.negotiation_status = 'rejected'
                    e.save()
                return Response('success') # reload page with jquery to display database changes
                # return HttpResponseRedirect(reverse('UserApp:single_product', args=(request.POST['order'],)))

        return HttpResponseRedirect(reverse('UserApp:all_orders'))


