from django.urls import path, include
from . import views
from .views import ClassSchedulesListView, SignupSet, signUpTraining, viewTraining, cancelEnrollment,ActivityLogView
# router = DefaultRouter()
# router.register(r'', UserLogViewSet)
from .views import ClassSchedulesListView, UserLogViewSet, SignupSet, TokenRevokeSet, CustomAuthToken, LocationList, LocationDetails

urlpatterns = [
    path('api/addClassSchedules/', ClassSchedulesListView.as_view()),
    path('api/checkin/', views.UserLogViewSet.as_view({'post': 'checkin'})),
    path('api/checkout/', views.UserLogViewSet.as_view({'put': 'checkout'})),
    path('api/signup/', SignupSet.as_view({'post': 'signup'})),
    path('api/signupfortraining/', signUpTraining.as_view({'post': 'signupfortraining'})),
    path('api/viewtrainings/', viewTraining.as_view({'get': 'viewtrainingdetails'})),
    # url endpoint to list trainings based on location-- <int:pk> below is the location id--
    path('api/viewtrainings/<int:pk>', viewTraining.as_view({'get': 'viewtrainingdetails'})),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('logout/', TokenRevokeSet.as_view({'delete': 'revoke'})),
    path('api/locations/', LocationList.as_view({'get': 'locations'})),
    path('api/locationdetails/', LocationDetails.as_view({'get': 'location_details'})),
    #url endpoint to cancel enrollments for trainings--<int:pk> below is the training id--
    path('api/cancelenrollment/<int:pk>', cancelEnrollment.as_view({'delete': 'destroy'})),
    path('api/logHours/', ActivityLogView.as_view({'post': 'create'})),
    
]
