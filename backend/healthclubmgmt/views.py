from django.shortcuts import render
from django.http.response import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
from .models import Training
from .serializers import TrainingSerializer, EnrollmentsSerializer
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from . import models
from django_filters.rest_framework import DjangoFilterBackend
# from django.contrib.auth.models import User
from .models import User_log, User
from .serializers import UserLogSerializer, UserSerializer


# Create your views here.

class ClassSchedulesListView(APIView):

    def post(self, request):
        data = request.data
        serializer = TrainingSerializer(data=data)

        if serializer.is_valid():
            start_time = serializer.validated_data['start_time']
            end_time = serializer.validated_data['end_time']
            if end_time < start_time:
                return Response({'error': 'End date/time cannot be less than Start date/time.'},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogViewSet(viewsets.ModelViewSet):
    queryset = User_log.objects.all()
    serializer_class = UserLogSerializer

    @action(detail=False, methods=['post'])
    def checkin(self, request):
        serializer = UserLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignupSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'])
    def signup(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class signUpTraining(generics.ListCreateAPIView):
    queryset = models.Enrollments.objects.all()

    serializer_class = EnrollmentsSerializer
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('user_id',)

    def create(self, request, *args, **kwargs):
        userTrainingObjects = []
        userTrainingIDs = []
        userTrainingObjects = models.Enrollments.objects.filter(user_id=request.data["user_id"])
        for i in userTrainingObjects:
            userTrainingIDs.append(i.training_id.training_id)
        print(userTrainingIDs)
        if (int(request.data["training_id"]) in userTrainingIDs):
            print("User ALREADY Registered for training")
            return Response({'error': 'User is already registered for this training!'},
                            status=status.HTTP_400_BAD_REQUEST)

        catch_training = models.Training.objects.get(pk=request.data["training_id"])
        catch_training.current_capacity += 1
        if catch_training.current_capacity > catch_training.max_capacity:
            return Response({
                                'error': 'Capacity for the training session is full, please reachout health club employee for further information'},
                            status=status.HTTP_400_BAD_REQUEST)
        catch_training.save()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
