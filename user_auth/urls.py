from django.urls import path, include
from rest_framework import routers
from user_auth import views

router = routers.DefaultRouter()
router.register(r'users', views.UserView, 'user')

urlpatterns = [
    path('', include(router.urls)),
]