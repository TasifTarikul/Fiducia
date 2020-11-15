from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.forms import AuthenticationForm
from .forms import UserSignUpForm, SelfPackItemForm, CreateOrderForm, JourneyForm
from .models import Order, Journey, JourneyOrder
from django.contrib import auth
from django.urls import reverse, path
from django.contrib.auth.decorators import login_required
from django.core.files.storage import FileSystemStorage
from django.urls import resolve
import stripe

from django.db.models import Q
# from .api.serializers import
from django.forms import formset_factory
import uuid


def sign_in(request):
    next= request.GET.get('next')
    if request.user.is_authenticated and request.user.is_superuser is False:
        return HttpResponseRedirect(reverse('UserApp:usrProfile'))
    if request.method == 'POST':
        next = request.GET.get('next')
        form = AuthenticationForm(request=request, data=request.POST)
        if form.is_valid():
            print(form.cleaned_data)
            print(next)
            try:
                user = auth.login(request, form.get_user())
                user = form.get_user()
                if user.account_status == 'deactive':  # reactive account if deactivated
                    user.accountq_status = 'active'
                    user.save()
                print('logged in successfully')
                try:
                    return HttpResponseRedirect(reverse(next))
                except:
                    print('url reverse didnt work')
                try:
                    return redirect(next)
                except:
                    print('redirect also didnt work')
            except Exception as e:
                print(e,'user can\'t logged in after register tasif')

        else:
            print('error ase ', form.errors.as_data())

    else:
        form = AuthenticationForm()
    print(next)
    context = {
        'user_signinform': form,
        'next':next
    }

    return render(request, 'UserApp/signInPage.html', context)


def sign_up(request):
    next = request.GET.get('next')
    if request.method == 'POST':
        next = request.GET.get('next')
        print(next)
        form = UserSignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=True)
            try:
                auth.login(request, user)
                if request.user.is_authenticated:
                    try:
                        return HttpResponseRedirect(reverse(next))
                    except:
                        print('url reverse didnt work')
                    try:
                        return redirect(next)
                    except:
                        print('redirect also didnt work')
            except Exception as e:
                print('user can\'t logged in after register tasif')
    else:
        form = UserSignUpForm()

    context = {
        'userSignUpform': form,
        'next': next
    }

    return render(request, 'UserApp/signUpPage.html', context)


def home_page(request):
    user = request.user

    context = {
        'user': user,
    }
    return render(request, 'UserApp/home_page.html', context)


@login_required
def usr_profile(request):
    # if request.user.is_superuser:  # checks wether the user is a superuser.
    #     return HttpResponseRedirect(reverse('superAdmin:dashboard'))
    user = request.user
    if 'upload_profile_pic' in request.POST:
        doc = request.FILES.get('profile_pic')

        if doc:
            fs = FileSystemStorage(location='Fiduciabeta/media/user_profile_images/'+str(user.id)+'/')
            filename = fs.save(doc.name, doc)
            user.profile_pic = 'user_profile_images/'+str(user.id)+'/'+filename
            user.save()
            return HttpResponseRedirect(reverse('UserApp:usrProfile'))

    context = {
        'user': user
    }

    return render(request, 'UserApp/userProfilePage.html', context)


def sendpackage(request):
    user = request.user
    if request.method == 'POST':
        user = request.user
        if user.is_authenticated and user.is_superuser is False:
            order = Order(
                orderer=user,
                order_type='selfpacked',
                order_status='awaiting',
                orderer_status=True,
                delivery_status='created',
            )
            form = SelfPackItemForm(request.POST, request.FILES, instance=order)
            if form.is_valid():
                print(form.cleaned_data['package_image'])
                form.save(commit=True)
                return HttpResponseRedirect(reverse('UserApp:sendpackage'))
        else:
            return HttpResponseRedirect(reverse('UserApp:signin')+'?next=UserApp:sendpackage')

    form = SelfPackItemForm()

    context = {
        # 'this_user': request.user,
        'form': form,
        'this_user': user
    }

    return render(request, 'UserApp/send_package_form_page.html', context)


def create_order(request):
    form = CreateOrderForm()
    if request.method == 'POST':
        user = request.user
        if user.is_authenticated and user.is_superuser is False:
            order = Order(
                orderer=user,
                order_type='cybershop',
                order_status='awaiting',
                orderer_status=True,
                delivery_status='created',
            )
            form = CreateOrderForm(request.POST, instance=order)
            if form.is_valid():
                form.save(commit=True)
                return HttpResponseRedirect(reverse('UserApp:createorder'))
            else:
                print(form.errors.as_data())
        return HttpResponseRedirect(reverse('UserApp:signin')+'?next=UserApp:createorder')
    context = {
        'user': request.user,
        'form': form
    }
    return render(request, 'UserApp/create_order.html', context)


def create_journey(request):
    if request.method == 'POST':
        user = request.user
        if user.is_authenticated and user.is_superuser is False:
            traveller = Journey(
                traveller=user,
                journey_status='active'
            )
            form = JourneyForm(request.POST, instance=traveller)
            if form.is_valid():
                form.save(commit=True)
                return HttpResponseRedirect(reverse('UserApp:create_journey'))
            else:
                print(form.errors)
        return HttpResponseRedirect(reverse('UserApp:signin')+'?next=UserApp:create_journey')

    form = JourneyForm()
    context = {
        'form': form,
        'user': request.user
    }
    return render(request, 'UserApp/be_a_traveller.html', context)

@login_required
def all_orders(request):
    return render(request, 'UserApp/order_list.html')

@login_required
def all_journey(request):
    return render(request, 'UserApp/journey_list.html')


def single_order(request, pk):
    order = Order.objects.get(pk=pk)
    negotiates = order.negotiates.all().filter(negotiation_status='active')
    context = {
        'user': request.user,
        'order': order,
        'negotiates': negotiates
    }
    return render(request, 'UserApp/single_order.html', context)


def single_journey(request, pk):
    journey = Journey.objects.get(pk=pk)
    orders = journey.orders.all().filter(order_status='accepted')
    negotiates = journey.negotiates.all().filter(negotiation_status='active')

    context = {
        'journey': journey,
        'orders': orders,
        'negotiates': negotiates
    }
    return render(request, 'UserApp/single_journey_page.html', context)


def payment(request, pk):
    order = Order.objects.get(pk=pk)
    user = request.user
    journey_order = JourneyOrder.objects.get(order=order, accepted_order_status='active')
    context = {
        'journey_order': journey_order
    }
    # if user.stripe_customer_id != '' and user.stripe_customer_id is not None:
    #     cards = stripe.Customer.list_sources(
    #         user.stripe_customer_id,
    #         limit=3,
    #         object='card'
    #     )
    #     cards_list = cards['data']
    #     if len(cards_list) > 0:
    #         context['card'] = cards_list[0]
    #
    # context['order'] = order

    return render(request, "UserApp/payment.html", context)

