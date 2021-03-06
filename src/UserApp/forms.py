from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from django.forms import ModelForm
from UserApp.models import Order, Journey


class UserSignUpForm(UserCreationForm):
    class Meta:
        model = get_user_model()
        exclude = ['is_favorite', 'account_status', 'profile_pic', 'user_permissions', 'is_staff', 'is_active',
                   'is_superuser', 'groups', 'last_login', 'date_joined', 'username',
                   'password', 'shopper_rating', 'traveller_rating', 'current_add_city', 'current_add_state',
                   'phone_no', 'short_bio', 'passport_no']


class SelfPackItemForm(ModelForm):
    class Meta:
        model = Order
        fields = ['package_image', 'package_weight', 'package_description',
                  'delivery_price', 'package_from', 'package_to', 'delivery_date']


class CreateOrderForm(ModelForm):
    class Meta:
        model = Order
        fields = ['package_image', 'url', 'package_description', 'cyber_product_price', 'delivery_price', 'delivery_date']


class JourneyForm(ModelForm):
    class Meta:
        model = Journey
        exclude = ['traveller', 'journey_status']
