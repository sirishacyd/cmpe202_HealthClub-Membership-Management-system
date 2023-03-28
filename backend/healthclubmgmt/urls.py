from django.urls import path
from .views import ClassSchedulesListView

urlpatterns = [
    path('api/addClassSchedules/', ClassSchedulesListView.as_view())
]