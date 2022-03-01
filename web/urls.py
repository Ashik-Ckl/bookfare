from django.urls import path
from . import views

urlpatterns = [
    path('',views.log_in),
    path('dashboard/',views.dashboard),
    path('branches/',views.branch),
    path('add-user/<str:pk>/',views.add_user),
    path('books/',views.book),
    path('transfer-history/',views.entries)
]