from django.contrib import admin
from .models import Order, User, Journey, JourneyOrder, Negotiate

# Register your models here.

admin.site.register(Order)
admin.site.register(User)
admin.site.register(Journey)
admin.site.register(JourneyOrder)
admin.site.register(Negotiate)
