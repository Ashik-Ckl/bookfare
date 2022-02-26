from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('get-books',views.GetBooksToBranch)

urlpatterns = [
    path('api/',include(router.urls)),
    path('login/',views.CreateTokenView.as_view()),
]