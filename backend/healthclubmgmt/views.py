from django.shortcuts import render
from django.http.response import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
from .models import Training
from .serializers import TrainingSerializer


# Create your views here.

class ClassSchedulesListView(APIView):

    def post(self, request):
        data = request.data
        serializer = TrainingSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse("Added Class Schedules Successfully", safe=False)
        return JsonResponse("Failed to Add Class Schedules", safe=False)
