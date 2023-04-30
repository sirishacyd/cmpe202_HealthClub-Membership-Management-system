from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
from .models import Training, Enrollments, Activity
from .serializers import TrainingSerializer, EnrollmentsSerializer, ActivityLogSerializer, ActivitySerializer
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
from .models import User_log, User, Location, ActivityLog, Activity
from .serializers import UserLogSerializer, UserSerializer, LocationSerializer
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from django.shortcuts import get_object_or_404
from datetime import datetime
from django.utils import timezone
import collections
from datetime import datetime, timedelta
import pytz
from django.db.models import Count
from collections import defaultdict
import json


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
    def updateMembership(self, request, user_id):
        try:
            userObject = User.objects.get(id=user_id)
            if (userObject.user_type == 'Member'):
                return Response({'error': 'User is already a member!'},
                                status=status.HTTP_400_BAD_REQUEST)
            elif (userObject.user_type == 'Admin'):
                return Response({'error': 'User is an employee!'},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                userObject.user_type = 'Member'
                userObject.save()
                serializer = UserSerializer(userObject)
                return Response(serializer.data, status=status.HTTP_200_OK)
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
        getUserObj = User.objects.filter(email=username)
        print(getUserObj)
        username = str(getUserObj.first().id)
        userTrainingObjects = Enrollments.objects.filter(username=username)
        userTrainingIDs = [i.training_id.training_id for i in userTrainingObjects]
        if int(training_id) in userTrainingIDs:
            return Response({'error': 'User is already registered for this training!'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Check if the training session is at capacity
        catch_training = Training.objects.get(pk=int(training_id))
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
        request.data["username"] = username
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


##
class enrollmentStats(viewsets.ModelViewSet):
    @action(detail=False, methods=['get'])
    def getEnrollmentStats(self, request, *args, **kwargs):
        permission_classes = [IsAdminUser]
        start_time_str = request.query_params.get('start_time')
        end_time_str = request.query_params.get('end_time')
        location_id = request.query_params.get('location_id')

        if not start_time_str or not end_time_str or not location_id:
            return Response({'error': 'start_time, end_time, and location_id are required parameters'})

        start_time = timezone.datetime.fromisoformat(start_time_str).replace(tzinfo=pytz.utc)
        end_time = timezone.datetime.fromisoformat(end_time_str).replace(tzinfo=pytz.utc)

        # Query enrollments based on start time range and location_id
        enrollment_counts = Enrollments.objects.filter(
            training_id__start_time__range=(start_time, end_time),
            training_id__location_id__location_id=location_id
        ).values('training_type').annotate(count=Count('training_type'))

        # Convert the queryset to a list of dictionaries for JSON serialization
        enrollment_counts_list = list(enrollment_counts)

        return Response(enrollment_counts_list)


##     


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
            location_address = training.location_id.location_address
            start_time = training.start_time.astimezone(pytz.timezone('America/Los_Angeles')).strftime(
                "%Y-%m-%d %I:%M %p")
            end_time = training.end_time.astimezone(pytz.timezone('America/Los_Angeles')).strftime("%Y-%m-%d %I:%M %p")
            memberdetails.append({
                'Training_id': training.training_id,
                'Instructor_name': training.instructor_name,
                'Class_Type': training.training_type,
                'Start_time': start_time,
                'End_time': end_time,
                'location_name': location_name,
                'location_address': location_address
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
            'user_id': nUser.id,
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


class ActivityList(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def activities(self, request):
        activities = self.get_queryset()
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)


class ActivityDetails(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def activity_details(self, request):
        activity_details = self.filter_queryset(self.get_queryset())
        activity_details = activity_details.values('id', 'type')
        serializer = self.get_serializer(activity_details, many=True)
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
            userObject = User.objects.get(username=email)
            response_data = {}
            response_data['id'] = userObject.id
            response_data['first_name'] = userObject.first_name
            response_data['last_name'] = userObject.last_name
            return JsonResponse(response_data)
        except:
            return Response({'error': 'User does not exist!'}, status=status.HTTP_400_BAD_REQUEST)


class ActivityLogSet(viewsets.ModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def getActivityLog(self, request):
        options = request.query_params.get('options', '')
        try:
            if options == '90_days':
                today = timezone.now()
                past_period = today - timedelta(days=90)
                logs = ActivityLog.objects.filter(username=request.user.id, timestamp__gte=past_period)
            elif options == 'week':
                today = timezone.now()
                past_period = today - timedelta(weeks=1)
                logs = ActivityLog.objects.filter(username=request.user.id, timestamp__gte=past_period)
            elif options == 'month':
                today = timezone.now()
                past_period = today - timedelta(weeks=4)
                logs = ActivityLog.objects.filter(username=request.user.id, timestamp__gte=past_period)
            else:
                return Response({'error': 'Invalid option'}, status=status.HTTP_400_BAD_REQUEST)

        except:
            return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

        data = []
        if (logs == None):
            return Response({'No logs found'}, status=status.HTTP_200_OK)
        for log in logs:
            data.append({
                'activity': log.activity.type,
                'duration': log.duration,
                'calories': log.calories,
                'timestamp': log.timestamp,
                'distance': log.distance

            })

        return JsonResponse({'logs': data})


class EquipmentViewSet(viewsets.ViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['get'])
    def equipmenttypes(self, request, pk=None):
        location_id = pk
        user_logs = User_log.objects.filter(location_id=location_id)
        activity_logs = ActivityLog.objects.filter(username__in=user_logs.values_list('username', flat=True))
        # activity_logs = ActivityLog.objects.filter(username__user_log__location_id=location_id)
        activity_counts = activity_logs.values('activity', 'activity__type').annotate(count=Count('activity')).order_by(
            '-count')
        activity_types = [{'type': count['activity__type'], 'count': count['count']} for count in activity_counts]
        return Response(activity_types)


class VisitorCountByHourViewSet(viewsets.ModelViewSet):
    queryset = User_log.objects.all()
    serializer_class = UserLogSerializer
    permission_classes = [IsAdminUser]

    def list(self, request, location_id):
        # Get the query parameters from the request
        time_period = self.request.query_params.get('time_period')
        options = self.request.query_params.get('options')
        selected_date = self.request.query_params.get('selected_date')
        if (location_id == 'none'):
            return Response({"error": "Please select a location"},
                            status=status.HTTP_400_BAD_REQUEST)
            # Filter user logs based on location
        user_logs = User_log.objects.filter(location_id=location_id)
        if time_period == 'weekday' or time_period == 'weekend':
            if not options:
                return Response({"error": "Please select a time range"},
                                status=status.HTTP_400_BAD_REQUEST)
            elif options == '90_days':
                today = timezone.now()
                past_period = today - timedelta(days=90)
                user_logs = user_logs.filter(checkin_time__gte=past_period)
            elif options == 'week':
                today = timezone.now()
                past_period = today - timedelta(weeks=1)
                user_logs = user_logs.filter(checkin_time__gte=past_period)
            elif options == 'month':
                today = timezone.now()
                past_period = today - timedelta(weeks=4)
                user_logs = user_logs.filter(checkin_time__gte=past_period)

        # Filter user logs based on time period
        if time_period == 'weekday':
            user_logs = user_logs.filter(checkin_time__week_day__range=(2, 6))  # Monday to Friday
        elif time_period == 'weekend':
            user_logs = user_logs.filter(checkin_time__week_day__in=[1, 7])
        elif time_period == 'day':
            if not selected_date:
                return Response({"error": "Please provide a selected_date for 'day' time period"},
                                status=status.HTTP_400_BAD_REQUEST)

            # Convert selected_date string to datetime object
            try:
                selected_date = datetime.strptime(selected_date, '%Y-%m-%d').date()
            except ValueError:
                return Response({"error": "Invalid date format for selected_date"},
                                status=status.HTTP_400_BAD_REQUEST)

            user_logs = user_logs.filter(checkin_time__date=selected_date)
        # Count the number of visitors by the hour
        visitor_counts = user_logs.values('checkin_time__hour').annotate(visitor_count=Count('*')).order_by(
            'checkin_time__hour')
        results = []
        for count in visitor_counts:
            hour = count['checkin_time__hour']
            hour_12 = datetime.strptime(str(hour), '%H').strftime('%I %p')
            result = {
                'hour': hour_12,
                'visitor_count': count['visitor_count']
            }
            results.append(result)
        return Response(results, status=status.HTTP_200_OK)


class HoursCountByLocationViewSet(viewsets.ModelViewSet):
    queryset = User_log.objects.all()
    serializer_class = UserLogSerializer
    permission_classes = [IsAdminUser]

    def list(self, request, location_id):
        # Retrieve data from User_log model
        if (location_id == 'none'):
            return Response({"error": "Please select a location"},
                            status=status.HTTP_400_BAD_REQUEST)
        user_logs = User_log.objects.filter(location_id=location_id)
        data = []
        for user_log in user_logs:
            user_id = user_log.username
            checkin_time = user_log.checkin_time
            checkout_time = user_log.checkout_time
            location_id = user_log.location_id
            if checkout_time:
                data.append((checkin_time, checkout_time))
        # Calculate hours
        daily_hours = defaultdict(int)
        weekly_hours = defaultdict(int)
        monthly_hours = defaultdict(int)
        results = []
        for check_in, check_out in data:
            check_in = datetime.fromisoformat(str(check_in))
            check_out = datetime.fromisoformat(str(check_out))

            duration = (check_out - check_in).seconds / 3600
            # Update daily_hours
            day_key = str(check_in.date().isoformat())
            daily_hours[day_key] += duration

            # Update weekly_hours
            week_key = str(check_in.year) + '_' + str(check_in.isocalendar()[1])
            weekly_hours[week_key] += duration

            # Update monthly_hours
            month_key = str(check_in.year) + '_' + str(check_in.month)
            monthly_hours[month_key] += duration
        response_data = {
            "daily_hours": {str(key): value for key, value in daily_hours.items()},
            "weekly_hours": {str(key): value for key, value in weekly_hours.items()},
            "monthly_hours": {str(key): value for key, value in monthly_hours.items()},
        }
        return Response(response_data, status=status.HTTP_200_OK)
