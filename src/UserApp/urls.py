from django.urls import path, include
from . import views
import uuid


app_name = 'UserApp'

urlpatterns = [
    path('fiducia/', views.home_page, name='homePage'),
    path('signin/', views.sign_in, name='signin'),
    path('signup/', views.sign_up, name='signup'),
    path('profile/', views.usr_profile, name='usrProfile'),
    path('send-package/', views.sendpackage, name='sendpackage'),
    path('create-order/', views.create_order, name='createorder'),
    path('create-journey/', views.create_journey, name='create_journey'),
    path('all-orders', views.all_orders, name='all_orders'),
    path('all-journey', views.all_journey, name='all_journey'),
    path('single-order/<str:pk>', views.single_order, name='single_product'),
    path('single-journey/<str:pk>', views.single_journey, name='single_journey'),
    path('payment/<str:pk>', views.payment, name='payment'),
    path('api/', include('UserApp.api.urls'), name='UserProfileApi')
]
