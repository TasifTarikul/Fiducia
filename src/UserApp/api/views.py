from rest_framework import viewsets
from rest_framework.parsers import JSONParser
from rest_framework.decorators import action, api_view

from rest_framework.response import Response
from .serializers import UserSerializer, OrderSerializer, JourneySerializer, JourneyOrderSerializer, NegotiateSerializer,PaymentSerializer
from ..models import Order, User, Journey, JourneyOrder, Negotiate, Payment
from django.db.models import Q
import time
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import redirect
import uuid
from django.conf import settings as conf_settings
from django.contrib import messages
from django.shortcuts import render
import stripe

import json


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    @action(detail=False)
    def user_active_orders(self, request):
        user = request.user
        all_active_orders = self.get_queryset().filter(Q(orderer=user) & Q(order_status='awaiting'))
        all_active_orders_serializer = self.serializer_class(all_active_orders, many=True)
        return Response(all_active_orders_serializer.data)

    @action(detail=False)
    def current_completed_order(self, request):
        user = request.user
        all_current_orders = self.get_queryset().filter(Q(orderer=user) & ~Q(order_status='received'))
        all_complete_orders = self.get_queryset().filter(Q(orderer=user) & Q(order_status='received'))
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

    def list(self, request, *args, **kwargs):
        active_journeys = self.get_queryset().filter(journey_status='active')
        active_journeys_serializer= self.serializer_class(active_journeys, many=True)
        return Response(active_journeys_serializer.data)



class JourneyOrderViewset(viewsets.ModelViewSet):
    serializer_class = JourneyOrderSerializer
    queryset = JourneyOrder.objects.all()


class NegotiateViewset(viewsets.ModelViewSet):
    serializer_class = NegotiateSerializer
    queryset = Negotiate

    # over written to redierct to order list page
    def create(self, request, *args, **kwargs):
        print(request.POST)
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
            # if accept button is pressed by orderer or negotiator during NEGOTIATION
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
        else:
            return Response('Accept not present in request')
    else:
        return Response('not a Post request')


# ------------- PAYMENT ----------
@api_view(['POST'])
def on_success_payment(request, journey_order_id):
    new_payment_serializer = PaymentSerializer(data=request.data)
    new_payment_serializer.is_valid(raise_exception=True)
    print(new_payment_serializer.validated_data)
    # new_payment_instance = new_payment_serializer.save()

    # Modify JourneyOrder innstance
    journey_order = JourneyOrder.objects.get(pk=journey_order_id)
    journey_order_serializer = JourneyOrderSerializer(journey_order, data={'payment': new_payment_instance.id}, partial=True)
    journey_order_serializer.is_valid(raise_exception=True)
    # journey_order_serializer.save()


    #Modify the related Order instance
    order = Order.objects.get(pk=journey_order.order.id)
    order_serializer = OrderSerializer(order, data={'payment_status': True}, partial=True)
    order_serializer.is_valid(raise_exception=True)
    print(order_serializer.validated_data)
    # order_serializer.save()
    print(order.id)

    # messages.success(request, "Your payment was successful")
    return HttpResponseRedirect(reverse("UserApp:single_product", args=(order.id,)))


# def charge_stripe(request, pk):
#
#     if request.method == 'POST':
#         print(request.POST)
#         token = request.POST['stripeToken']
#         user = request.user
#         amount = int(request.POST['amount']) * 100
#         save = False
#         use_default_card = False
#         if 'save' in request.POST:
#             save = True
#             print(save)
#         if 'use_default_card' in request.POST:
#             use_default_card = True
#             print(use_default_card)
#
#         if save:
#             if user.stripe_customer_id != '' and user.stripe_customer_id is not None:
#                 customer = stripe.Customer.retrieve(
#                     user.stripe_customer_id)
#                 customer.sources.create(source=token)
#             else:
#                 customer = stripe.Customer.create(
#                     name=user.first_name + ' ' + user.last_name,
#                     email=user.email,
#                 )
#                 customer.sources.create(source=token)
#                 user.stripe_customer_id = customer['id']
#                 user.save()
#
#         try:
#             # Use Stripe's library to make requests...
#             if save or use_default_card:
#                 charge = stripe.Charge.create(
#                     amount=amount,
#                     currency='myr',
#                     customer=customer['id']
#                 )
#             else:
#                 charge = stripe.Charge.create(
#                     amount=amount,
#                     currency='myr',
#                     source=token
#                 )
#                 # on_success_payment('stripe', pk, amount, charge['id'],request)
#             return HttpResponseRedirect(reverse('UserApp:single_product', args=(pk,)))
#
#         except stripe.error.CardError as e:
#             # Since it's a decline, stripe.error.CardError will be caught
#
#             print('Status is: %s' % e.http_status)
#             print('Type is: %s' % e.error.type)
#             print('Code is: %s' % e.error.code)
#             # param is '' in this case
#             print('Param is: %s' % e.error.param)
#             print('Message is: %s' % e.error.message)
#             body = e.json_body
#             err = body.get('error', {})
#             messages.error(request, {err.get('messages')})
#
#         # STRIPE EXCEPTION
#
#         except stripe.error.RateLimitError as e:
#             # Too many requests made to the API too quickly
#             messages.error(request, 'Rate limit Error. Please try again')
#             pass
#         except stripe.error.InvalidRequestError as e:
#             # Invalid parameters were supplied to Stripe's API
#             messages.error(request, 'Invalid Request')
#             pass
#         except stripe.error.AuthenticationError as e:
#             # Authentication with Stripe's API failed
#             # (maybe you changed API keys recently)
#             messages.error(request, 'Authentication failed')
#             pass
#         except stripe.error.APIConnectionError as e:
#             # Network communication with Stripe failed
#             messages.error(request, 'API connection error please try again')
#             pass
#         except stripe.error.StripeError as e:
#             # Display a very generic error to the user, and maybe send
#             # yourself an email
#             messages.error(request, 'Something went wrong. You were not charged.Please try again')
#             pass
#         except Exception as e:
#             # Something else happened, completely unrelated to Stripe
#             messages.error(request, 'A serious error occurred. We have been notifed.')
#             print(e)
#             pass
#         return HttpResponseRedirect(reverse('UserApp:checkout', args=(pk,)) + '#stripe-payment-option')




