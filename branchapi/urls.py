from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('get-books',views.GetBooksToBranch),
router.register('customer',views.Customer),
router.register('invoices',views.Invoices)

urlpatterns = [
    path('api/',include(router.urls)),
    path('login/',views.CreateTokenView.as_view()),
    path('create-invoice/',views.CreateInvoice.as_view()),
    path('user/',views.User.as_view()),
    path('logout/',views.Logout.as_view()),
]