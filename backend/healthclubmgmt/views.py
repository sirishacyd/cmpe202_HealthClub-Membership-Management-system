from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
# from django.contrib.auth.models import User
from .models import User_log, User
from .serializers import UserLogSerializer

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