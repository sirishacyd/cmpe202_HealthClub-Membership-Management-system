from django.urls import path,include
from . import views
from .views import ClassSchedulesListView, SignupSet
from rest_framework.routers import DefaultRouter
# router = DefaultRouter()
# router.register(r'', UserLogViewSet)
urlpatterns = [
    path('api/addClassSchedules/', ClassSchedulesListView.as_view()),
    path('api/checkin/', views.UserLogViewSet.as_view({'post': 'checkin'})),
    path('api/checkout/', views.UserLogViewSet.as_view({'post': 'checkout'})),
    path('api/signup/', SignupSet.as_view({'post': 'signup'})),
    path('api/signuptraining/', views.signUpTraining.as_view()),
]