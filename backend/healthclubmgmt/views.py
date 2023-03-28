from django.shortcuts import render
from django.http.response import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
from .models import Training
from .serializers import TrainingSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
# from django.contrib.auth.models import User
from .models import User_log, User
from .serializers import UserLogSerializer, UserSerializer

# Create your views here.

class ClassSchedulesListView(APIView):

    def post(self, request):
        data = request.data
        serializer = TrainingSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse("Added Class Schedules Successfully", safe=False)
        return JsonResponse("Failed to Add Class Schedules", safe=False)


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
