from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserLogViewSet

router = DefaultRouter()
router.register(r'user_logs', UserLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]