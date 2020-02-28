from django.contrib import admin
from .models import Order, User, Journey, JourneyOrder

# Register your models here.

admin.site.register(Order)
admin.site.register(User)
admin.site.register(Journey)
admin.site.register(JourneyOrder)
