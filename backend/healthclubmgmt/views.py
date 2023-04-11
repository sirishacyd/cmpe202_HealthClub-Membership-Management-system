from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
from .models import Training, Enrollments
from .serializers import TrainingSerializer, EnrollmentsSerializer, ActivityLogSerializer
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from . import models
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
# from django.contrib.auth.models import User
from .serializers import TrainingSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from .models import User_log, User, Location
from .serializers import UserLogSerializer, UserSerializer, LocationSerializer
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from django.shortcuts import get_object_or_404
from datetime import datetime
from django.utils import timezone
from datetime import datetime, timedelta
import pytz


# Create your views here.

class ClassSchedulesListView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        data = request.data
        serializer = TrainingSerializer(data=data)

        if serializer.is_valid():
            start_time = serializer.validated_data['start_time']
            end_time = serializer.validated_data['end_time']
            current_time = timezone.now()
            if end_time < start_time:
                return Response({'error': 'End date/time cannot be less than Start date/time.'},
                                status=status.HTTP_400_BAD_REQUEST)
            elif start_time < current_time or end_time < current_time:
                return Response({'error': 'Start or End date/time cannot be less than current system time.'},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogViewSet(viewsets.ModelViewSet):
    queryset = User_log.objects.all()
    serializer_class = UserLogSerializer
    permission_classes = [IsAdminUser]

    def checkin(self, request):
        username = request.data.get('username')
        location_id = request.data.get('location_id')  # Get location from request data

        # Filter user_log entries by both username and location
        try:
            latest_log_entry = User_log.objects.filter(username=username, location_id=location_id).latest(
                'checkin_time')
            if latest_log_entry.checkout_time is None:
                return Response({'error': 'User has already checked in at this location and not yet checked out.'},
                                status=status.HTTP_400_BAD_REQUEST)
        except User_log.DoesNotExist:
            pass  # Allow check-in if no previous entry is found for the location

        current_time = datetime.utcnow()
        formatted_time = current_time.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
        request.data['checkin_time'] = formatted_time

        serializer = UserLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['put'])
    def checkout(self, request):
        username = request.data.get('username')
        location_id = request.data.get('location_id')
        current_time = datetime.utcnow()
        checkout_time = current_time.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
        request.data['checkout_time'] = checkout_time
        try:
            log_entry = User_log.objects.filter(username=username, location_id=location_id).latest('checkin_time')
            if log_entry.checkout_time:
                return Response({'error': 'User has already checked out.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                log_entry.checkout_time = checkout_time
                log_entry.save()
                serializer = UserLogSerializer(log_entry)
                return Response(serializer.data)
        except User_log.DoesNotExist:
            return Response({'error': 'User has no check-in entry.'}, status=status.HTTP_400_BAD_REQUEST)


class SignupSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['post'])
    def signup(self, request):
        try:
         serializer = UserSerializer(data=request.data)
         if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except:
            return Response({'error': 'Invalid email address!'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.errors['username'] != None:
            return Response({'error': serializer.errors['username']}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['put'])
    def updateMembership(self,request,user_id):
        try:
         userObject=User.objects.get(id=user_id)
         if(userObject.user_type=='Member'):
            return Response({'error': 'User is already a member!'},
                            status=status.HTTP_400_BAD_REQUEST)
         elif(userObject.user_type=='Admin'):
             return Response({'error': 'User is an employee!'},
                            status=status.HTTP_400_BAD_REQUEST)
         else:
            userObject.user_type='Member'
            userObject.save()
            serializer=UserSerializer(userObject)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response({'error': 'User does not exist!'}, status=status.HTTP_400_BAD_REQUEST)

class signUpTraining(viewsets.ModelViewSet):
    queryset = Enrollments.objects.all()
    serializer_class = EnrollmentsSerializer

    @action(detail=False, methods=['post'])
    def signupfortraining(self, request, *args, **kwargs):
        username = request.user.username
        userTrainingObjects = []
        userTrainingObjects = Enrollments.objects.filter(username=request.user.id)
        userTrainingIDs = [i.training_id.training_id for i in userTrainingObjects]
        if int(request.data["training_id"]) in userTrainingIDs:
            return Response({'error': 'User is already registered for this training!'},
                            status=status.HTTP_400_BAD_REQUEST)

        catch_training = Training.objects.get(pk=request.data["training_id"])
        if catch_training.current_capacity >= catch_training.max_capacity:
            return Response({
                'error': 'Capacity for the training session is full, please reach out to a health club employee for further information'},
                status=status.HTTP_400_BAD_REQUEST)
        catch_training.current_capacity += 1
        catch_training.save()
        request.data["username"] = request.user.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['post'])
    def signUpnonmembersfortraining(self, request):
    # Check if the user is an admin
        permission_classes = [IsAdminUser]

    # Get the username and training_id from the request data
        username = request.data.get('username')
        training_id = request.data.get('training_id')

    # Check if the user is already enrolled in this training
        userTrainingObjects = Enrollments.objects.filter(username=username)
        userTrainingIDs = [i.training_id.training_id for i in userTrainingObjects]
        if int(training_id) in userTrainingIDs:
            return Response({'error': 'User is already registered for this training!'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Check if the training session is at capacity
        catch_training = Training.objects.get(pk=training_id)
        if catch_training.current_capacity >= catch_training.max_capacity:
            return Response({
            'error': 'Capacity for the training session is full'},
            status=status.HTTP_400_BAD_REQUEST)

    # Check if the user's trial membership has expired
        user = User.objects.get(id=username)
        current_time = datetime.now(pytz.utc)
        sub_expiry_date = user.date_joined + timedelta(days=30)
        if (current_time > sub_expiry_date):
            return Response({
            'error': 'User trial membership has expired!'},
            status=status.HTTP_400_BAD_REQUEST)
        

    # Check if the training session is scheduled after the user's trial membership expiration
        if catch_training.start_time >= sub_expiry_date:
            return Response({
            'error': 'Training session is scheduled after user trial membership expiration!'},
            status=status.HTTP_400_BAD_REQUEST)
        
        catch_training.current_capacity += 1
        catch_training.save()
        #request.data["username"] = user.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

       

        

class cancelEnrollment(viewsets.ModelViewSet):
    queryset = Enrollments.objects.all()
    serializer_class = EnrollmentsSerializer

    # pk_field = 'training_id'
    @action(detail=False, methods=['delete'])
    def destroy(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        userid = request.user.id
        training_id = kwargs['pk']
        obj = get_object_or_404(queryset, username=userid, training_id=training_id)
        training_obj = Training.objects.get(training_id=training_id)
        training_obj.current_capacity -= 1
        training_obj.save()
        obj.delete()
        return Response({'Enrollment deleted!'}, status=status.HTTP_204_NO_CONTENT)


"""This returns all training for a loction with pk """


class viewTraining(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def viewtrainingdetails(self, request, *args, **kwargs):
        try:
            location_id = kwargs['pk']
            if kwargs['pk']:
                location_id = kwargs['pk']
                training = Training.objects.filter(location_id=location_id)
                serializer = TrainingSerializer(training, many=True)
                return Response(serializer.data)
        except:
            training = Training.objects.filter()
            serializer = TrainingSerializer(training, many=True)
            return Response(serializer.data)


# This API is used for retrieving Member specific enrollment details
class ViewMemberTrainingEnrollment(viewsets.ModelViewSet):
    serializer_class = TrainingSerializer

    @action(detail=False, methods=['get'])
    def list(self, request, user_id=None):
        enrollments = Enrollments.objects.filter(username__id=request.user.id).select_related('training_id')
        training_ids = [enrollment.training_id_id for enrollment in enrollments]
        trainings = Training.objects.filter(training_id__in=training_ids).select_related('location_id')

        memberdetails = []
        for training in trainings:
            location_name = training.location_id.location_name
            memberdetails.append({
                'Instructor_name': training.instructor_name,
                'Class_Type': training.training_type,
                'Start_time': training.start_time,
                'End_time': training.end_time,
                'location_name': location_name
            })

        return Response(memberdetails)


class TokenRevokeSet(viewsets.ModelViewSet):
    @action(detail=False, methods=['delete'])
    def revoke(self, request):
        request.auth.delete()
        return Response({'Logged out successfully!'}, status=status.HTTP_200_OK)


class CustomAuthToken(ObtainAuthToken):
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        nUser = User.objects.filter(username=user.username).get()
        if nUser.isNonMember():
            return Response({"Non-members can't login"}, status=status.HTTP_403_FORBIDDEN)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'first_name': user.first_name,
            'user_type': nUser.user_type,
        })


class LocationList(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def locations(self, request):
        locations = self.get_queryset()
        serializer = self.get_serializer(locations, many=True)
        return Response(serializer.data)


class LocationDetails(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def location_details(self, request):
        location_details = self.filter_queryset(self.get_queryset())
        location_details = location_details.values('location_name', 'location_address')
        serializer = self.get_serializer(location_details, many=True)
        return Response(serializer.data)


class ActivityLogView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  # Or other permissions you want to set

    @action(detail=False, methods=['post'])
    def create(self, request):
        serializer = ActivityLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request, email):
        try:
            userObject=User.objects.get(username=email)
            response_data = {}
            response_data['id'] = userObject.id
            response_data['first_name'] = userObject.first_name
            response_data['last_name'] = userObject.last_name
            return JsonResponse(response_data)
        except:
            return Response({'error': 'User does not exist!'}, status=status.HTTP_400_BAD_REQUEST)
