from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from coreapp.commonData import all_countries
from django.conf import settings
import uuid
import os

# user model modified to sign in with email


class MyUserManager(BaseUserManager):
    """
    A custom user manager to dea---l with emails as unique identifiers for auth
    instead of usernames. The default that's used is "UserManager"
    """
    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, password, **extra_fields)


# --------------custom model------------------------
class User(AbstractUser):

    _Rating_CHOICES = (
        (1, 'Poor'),
        (2, 'Average'),
        (3, 'Good'),
        (4, 'Very Good'),
        (5, 'Excellent')
    )

    _account_status_list = (
            ('sender', 'Sender'),
            ('traveler', 'Traveler'),
            ('neutral', 'Neutral'),
        )

    def profile_pic_folder(self, imagename):
        path = "user_profile_images/" + str(self.id) +"/"+ imagename
        return path
    username = models.CharField(max_length=150, unique=False, null=True, blank=True)
    date_joined = models.DateTimeField( null=True, blank=True)
    timestamp = models.DateField(null=True, blank=True, auto_now_add=True)
    email = models.EmailField(unique=True, null=False)
    phone_no = models.CharField(max_length=100, null=True, blank=True)
    profile_pic = models.FileField(upload_to=profile_pic_folder, null=True, blank=True)
    short_bio = models.CharField(max_length=4000, null=True, blank=True)
    passport_no = models.CharField(max_length=50, null=True, blank=True)
    country_of_residence = models.CharField(max_length=50, null=True, blank=False, choices=all_countries())
    current_add_city = models.CharField(max_length=50, null=True, blank=True)
    current_add_state = models.CharField(max_length=50, null=True, blank=True)
    nationality = models.CharField(max_length=100, null=True, blank=False, choices=all_countries())
    account_status = models.CharField(max_length=50, default='active', null=True, blank=True, choices=_account_status_list)
    traveller_rating = models.IntegerField(choices=_Rating_CHOICES, default=1)
    shopper_rating = models.IntegerField(choices=_Rating_CHOICES, default=1)

    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = MyUserManager()

    def __str__(self):
        return str(self.id)


class Journey(models.Model):

    __journey_status = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    traveller = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)
    journey_status = models.CharField(max_length=50, null=True, blank=True, choices=__journey_status)
    depart_date = models.DateField(null=True, blank=False)
    depart_area_name = models.CharField(max_length=50, null=True, blank=False)
    destination_date = models.DateField(null=True, blank=False)
    destination_area_name = models.CharField(max_length=50, null=True, blank=False)

    def __str__(self):
        return self.traveller.email


class Order(models.Model):

    __order_type = (
        ('cybershop', 'CyberShopping'),
        ('selfpacked', 'SelfPacked')
    )

    __order_status = (
        ('awaiting', 'Awaiting'),
        ('accepted', 'Acccepted'),
        ('received', 'Received')
    )

    __delivery_status = (
        ('en_route', 'En Route'),
        ('delivered', 'Delivered')
    )

    def update_filename(instance, filename):
        path = "order_images/"+str(instance.id)+filename.split('.')[0]+"."+filename.split('.')[1]
        return path
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_type = models.CharField(max_length=50, null=True, blank=True, choices=__order_type)
    timestamp = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    url = models.CharField(max_length=3000, null=True, blank=False)
    package_image = models.ImageField(upload_to=update_filename, null=True, blank=False)
    package_weight = models.FloatField(null=True, blank=False)
    package_description = models.CharField(max_length=3000, null=True, blank=False)
    delivery_price = models.FloatField(null=True, blank=False)
    delivery_date = models.DateField(null=True, blank=False)
    cyber_product_price = models.FloatField(null=True, blank=False)
    order_status = models.CharField(max_length=50, null=True, choices=__order_status)
    orderer_status = models.BooleanField(default=False, null=True, blank=True)
    traveller_status = models.BooleanField(default=False, null=True, blank=True)
    delivery_status = models.CharField(max_length=100, null=True, blank=True, choices=__delivery_status)
    package_from = models.CharField(max_length=200, null=True, blank=True)
    package_to = models.CharField(max_length=200, null=True, blank=False)
    journey = models.ForeignKey(Journey, null=True, blank=True, on_delete=models.SET_NULL, related_name='orders')
    orderer = models.ForeignKey(settings.AUTH_USER_MODEL,
                                null=True, blank=True, on_delete=models.SET_NULL)
    payment_status = models.BooleanField(default=False, null=True, blank=True)

    def __str__(self):
        return self.package_description


class Negotiate(models.Model):

    __negotiation_status = (
        ('active', 'Active'),
        ('accepted_by_negotiator', 'Accepted by Negotiator'),
        ('accepted_by_orderer', 'Accepted by Orderer'),
        ('rejected_by_orderer', 'Rejected by Orderer'),
        ('rejected_by_traveller', 'Rejected by Traveller'),
        ('cancelled', 'Cancelled')
    )

    order = models.ForeignKey(Order, null=True, blank=True, on_delete=models.SET_NULL, related_name='negotiates')
    journey = models.ForeignKey(Journey, null=True, blank=True, on_delete=models.SET_NULL, related_name='negotiates')
    negotiator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    negotiator_price = models.CharField(max_length=100, null=True, blank=True)
    orderer_price = models.CharField(max_length=100, null=True, blank=True)
    negotiation_status = models.CharField(max_length=50, null=True, blank=True, choices=__negotiation_status)
    timestamp = models.DateTimeField(null=True, blank=True, auto_now_add=True)

    # def __str__(self):
    #     return str(self.negotiator)


class JourneyOrder(models.Model):

    __accepted_order_status = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    )

    journey = models.ForeignKey(Journey, null=True, blank=True, on_delete=models.SET_NULL,
                                related_name='journey_order')
    order = models.ForeignKey(Order, null=True, blank=True, on_delete=models.SET_NULL)
    accepted_order_status = models.CharField(max_length=50, null=True, blank=True, choices=__accepted_order_status)
    payment = models.ForeignKey("Payment", null=True, blank=True, on_delete=models.SET_NULL)
    timestamp = models.DateTimeField(null=True, blank=True, auto_now_add=True)


class Payment(models.Model):

    __paymnt_gtway_name = (
        ('stripe', 'Stripe'),
        ('paypal', 'Paypal')
    )
    delivery_price = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    paymnt_gtway_name = models.CharField(max_length=100, null=True, blank=True, choices=__paymnt_gtway_name)
