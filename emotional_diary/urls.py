from django.urls import path, include
from rest_framework import routers
from emotional_diary import views

router = routers.DefaultRouter()
router.register(r'emotions', views.EmotionView, 'emotion')
router.register(r'my-diary', views.DiaryView, 'my-diary')
router.register(r'my-entries', views.DiaryEntryView, 'my-entries')
router.register(r'my-objectives', views.ObjectiveView, 'my-objectives')

urlpatterns = [
    path('', include(router.urls)),
]