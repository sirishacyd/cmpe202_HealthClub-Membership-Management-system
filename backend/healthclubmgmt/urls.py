from django.urls import path,include
from .views import ClassSchedulesListView,UserLogViewSet
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'', UserLogViewSet)
urlpatterns = [
    path('api/addClassSchedules/', ClassSchedulesListView.as_view()),
    path('api/checkin/', include(router.urls)),
]