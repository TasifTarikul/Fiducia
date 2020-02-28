from UserApp.models import Order
from rest_framework import serializers
from ..models import User, Order, Journey, JourneyOrder


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['is_active', 'is_staff', 'password', 'last_login', 'is_superuser']


class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = '__all__'


class JourneySerializer(serializers.ModelSerializer):

    class Meta:
        model = Journey
        fields = '__all__'


class JourneyOrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = JourneyOrder
        fields = '__all__'
