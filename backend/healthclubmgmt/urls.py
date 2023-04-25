from django.urls import path, include
from . import views
from .views import ClassSchedulesListView, SignupSet, signUpTraining, viewTraining, cancelEnrollment, ActivityLogView
# router = DefaultRouter()
# router.register(r'', UserLogViewSet)
from .views import ClassSchedulesListView, UserLogViewSet, UserViewSet, SignupSet, TokenRevokeSet, CustomAuthToken, \
    LocationList, LocationDetails, ViewMemberTrainingEnrollment, ActivityList, ActivityLogSet, EquipmentViewSet,enrollmentStats, VisitorCountByHourViewSet, HoursCountByLocationViewSet

urlpatterns = [
    path('api/addClassSchedules/', ClassSchedulesListView.as_view()),
    path('api/checkin/', views.UserLogViewSet.as_view({'post': 'checkin'})),
    path('api/checkout/', views.UserLogViewSet.as_view({'put': 'checkout'})),
    path('api/signup/', SignupSet.as_view({'post': 'signup'})),
    path('api/updateMembership/<int:user_id>', SignupSet.as_view({'put': 'updateMembership'})),
    path('api/user/<str:email>', UserViewSet.as_view({'get': 'get'})),
    path('api/signupfortraining/', signUpTraining.as_view({'post': 'signupfortraining'})),
    path('api/signupnonmembers/', signUpTraining.as_view({'post': 'signUpnonmembersfortraining'})),
    path('api/viewtrainings/', viewTraining.as_view({'get': 'viewtrainingdetails'})),
    # url endpoint to list trainings based on location-- <int:pk> below is the location id--
    path('api/viewtrainings/<int:pk>', viewTraining.as_view({'get': 'viewtrainingdetails'})),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('logout/', TokenRevokeSet.as_view({'delete': 'revoke'})),
    # API endpoint for get all location details including location id
    path('api/locations/', LocationList.as_view({'get': 'locations'})),
    path('api/activities/', ActivityList.as_view({'get': 'activities'})),
    # API endpoint for get location name and location address
    path('api/locationdetails/', LocationDetails.as_view({'get': 'location_details'})),
    # url endpoint to cancel enrollments for trainings--<int:pk> below is the training id--
    path('api/cancelenrollment/<int:pk>', cancelEnrollment.as_view({'delete': 'destroy'})),
    path('api/logHours/', ActivityLogView.as_view({'post': 'create'})),
    # API endpoint for view member specific training enrollment details
    path('api/viewmembertrainingenrollment/', ViewMemberTrainingEnrollment.as_view({'get': 'list'})),
    path('api/getActivityLog/', ActivityLogSet.as_view({'get': 'getActivityLog'})),
    path('api/equipmenttypes/<int:pk>', EquipmentViewSet.as_view({'get': 'equipmenttypes'})),
    #url endpoint get enrollment statistics
    path('api/enrollmentstats/', enrollmentStats.as_view({'get':'getEnrollmentStats'})),
    path('api/visitorCount/<int:location_id>/', VisitorCountByHourViewSet.as_view({'get': 'list'})),
    path('api/loghoursCount/<int:location_id>/', HoursCountByLocationViewSet.as_view({'get': 'list'}))
    
]
