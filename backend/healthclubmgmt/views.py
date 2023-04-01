from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
from .models import Training, Enrollments
from .serializers import TrainingSerializer, EnrollmentsSerializer
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .import models
from django_filters.rest_framework import DjangoFilterBackend
# from django.contrib.auth.models import User
from .serializers import TrainingSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from .models import User_log, User
from .serializers import UserLogSerializer, UserSerializer
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny,IsAdminUser
from rest_framework.authtoken.views import ObtainAuthToken


# Create your views here.

class ClassSchedulesListView(APIView):
    permission_classes = [AllowAny]
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
    
    @action(detail=False, methods=['put'])
    def checkout(self, request):
        username = request.data.get('username')
        checkout_time = request.data.get('checkout_time')
        try:
            log_entry = User_log.objects.filter(username=username).latest('checkin_time')
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
    permission_classes = [AllowAny] 

    @action(detail=False, methods=['post'])
    def signup(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class signUpTraining(viewsets.ModelViewSet):
    queryset = Enrollments.objects.all()
    serializer_class = EnrollmentsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['username']
    
    @action(detail=False, methods=['post'])
    def signupfortraining(self, request, *args, **kwargs):
        userTrainingObjects = Enrollments.objects.filter(username=request.data["username"])
        userTrainingIDs = [i.training_id.training_id for i in userTrainingObjects]
        if int(request.data["training_id"]) in userTrainingIDs:
            return Response({'error': 'User is already registered for this training!'}, status=status.HTTP_400_BAD_REQUEST)

        catch_training = Training.objects.get(pk=request.data["training_id"])
        if catch_training.current_capacity >= catch_training.max_capacity:
            return Response({'error': 'Capacity for the training session is full, please reach out to a health club employee for further information'}, status=status.HTTP_400_BAD_REQUEST)
        catch_training.current_capacity += 1
        catch_training.save()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
class viewTraining(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    lookup_field = 'pk'
    @action(detail=False, methods=['get'])
    def viewtrainingdetails(self, request, pk=None):
        if pk is not None:
            training = self.get_object()
            serializer = self.get_serializer(training)
            return Response(serializer.data)
        else:
            trainings = self.get_queryset()
            serializer = self.get_serializer(trainings, many=True)
            return Response(serializer.data)

class TokenRevokeSet(viewsets.ModelViewSet):
    @action(detail=False, methods=['delete'])
    def revoke(self, request):
        request.auth.delete()
        return Response({'Logged out successdfully!'},status=status.HTTP_200_OK)

class CustomAuthToken(ObtainAuthToken):
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        nUser = User.objects.filter(username=user.username).get()
        if nUser.isNonMember():
            return Response({"Non-members can't login"},status=status.HTTP_403_FORBIDDEN)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'first_name': user.first_name,
        })
