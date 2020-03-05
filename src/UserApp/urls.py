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
    path('be-traveller/', views.be_traveller, name='be_traveller'),
    path('all-orders', views.all_orders, name='all_orders'),
    path('all-travellers', views.all_travellers, name='alltraveller'),
    path('single-order/<str:pk>', views.single_order, name='single_product'),
    path('api/', include('UserApp.api.urls'), name='UserProfileApi')
]
