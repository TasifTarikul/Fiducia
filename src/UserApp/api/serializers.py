from UserApp.models import Order
from rest_framework import serializers
from ..models import User, Order, Journey, JourneyOrder, Negotiate, Payment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['is_active', 'is_staff', 'password', 'last_login', 'is_superuser']


class NegotiateSerializer(serializers.ModelSerializer):

    traveller = serializers.IntegerField(source='journey.traveller.id', allow_null=True)
    #to check negotiation if process, see order_list_page.js

    class Meta:
        model = Negotiate
        fields = ['order', 'journey', 'negotiator', 'negotiator_price', 'orderer_price',
                  'negotiation_status', 'timestamp', 'traveller']


class JourneyOrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = JourneyOrder
        fields = '__all__'


class JourneySerializer(serializers.ModelSerializer):

    negotiates = NegotiateSerializer(many=True, read_only=True)
    journey_order = JourneyOrderSerializer(many=True, read_only=True)
    traveller = UserSerializer()

    class Meta:
        model = Journey
        fields = ['id', 'traveller', 'journey_status', 'depart_date', 'depart_area_name',
                  'destination_date', 'destination_area_name', 'negotiates', 'journey_order']


class OrderSerializer(serializers.ModelSerializer):

    journey = JourneySerializer(many=False)
    negotiates = NegotiateSerializer(many=True, read_only=True)
    orderer = UserSerializer(many=False)

    class Meta:
        model = Order
        fields = ['id', 'order_type', 'timestamp', 'url', 'package_image', 'package_weight',
                  'package_description', 'delivery_price', 'delivery_date', 'cyber_product_price', 'order_status',
                  'orderer_status', 'traveller_status', 'delivery_status', 'package_from', 'package_to', 'journey',
                  'orderer', 'negotiates', 'payment_status']


class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = '__all__'
