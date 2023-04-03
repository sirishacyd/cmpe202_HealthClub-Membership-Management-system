from django.urls import path, include
from . import views
from .views import ClassSchedulesListView, SignupSet, signUpTraining, viewTraining
# router = DefaultRouter()
# router.register(r'', UserLogViewSet)
from .views import ClassSchedulesListView, UserLogViewSet, SignupSet, TokenRevokeSet, CustomAuthToken, LocationList, LocationDetails

urlpatterns = [
    path('api/addClassSchedules/', ClassSchedulesListView.as_view()),
    path('api/checkin/', views.UserLogViewSet.as_view({'post': 'checkin'})),
    path('api/checkout/', views.UserLogViewSet.as_view({'post': 'checkout'})),
    path('api/signup/', SignupSet.as_view({'post': 'signup'})),
    path('api/signupfortraining/', signUpTraining.as_view({'post': 'signupfortraining'})),
    path('api/viewtrainings/', viewTraining.as_view({'get': 'viewtrainingdetails'})),
    # url endpoint to list trainings based on location-- <int:pk> below is the location id--
    path('api/viewtrainings/<int:pk>', viewTraining.as_view({'get': 'viewtrainingdetails'})),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('logout/', TokenRevokeSet.as_view({'delete': 'revoke'})),
    path('api/locations/', LocationList.as_view({'get': 'locations'})),
    path('api/locationdetails/', LocationDetails.as_view({'get': 'location_details'})),
    
]
