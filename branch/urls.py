from django.urls import path,include
from . import views

urlpatterns = [
    path('',views.log_in),
    path('dashboard/',views.dashboard),
    path('create-invoice/',views.create_invoice),
    path('invoices/',views.invoices),
    path('invoice/',views.view_invoice),
]