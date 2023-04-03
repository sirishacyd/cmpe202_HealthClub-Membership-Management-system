from django.forms import ValidationError
from rest_framework import serializers
from .models import Training, Enrollments
from .models import Activity, ActivityLog, Location, User, User_log
# Training Model Serializer
from .models import Training,User_log, Location,User
# from django.contrib.auth.models import User
from .models import Training
from .models import Activity, ActivityLog, User

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('location_id', 'location_name', 'location_address')

class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = ('training_id', 'instructor_name', 'training_type', 'start_time', 'end_time', 'max_capacity', 'current_capacity', 'location_id')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'phone', 'user_type', 'trial_expiry', 'password')

class UserLogSerializer(serializers.ModelSerializer):
    username = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    location_id = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all())

    class Meta:
        model = User_log
        fields = ('id', 'username', 'checkin_time', 'checkout_time', 'location_id')

    def create(self, validated_data):
        username = validated_data.get('username')
        checkin_time = validated_data.get('checkin_time')
        location_id = validated_data.get('location_id')
        checkout_time = validated_data.get('checkout_time')
        user_log = User_log(username=username, checkin_time=checkin_time, checkout_time=checkout_time, location_id=location_id)
        user_log.save()
        return user_log
        
class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ('id', 'name', 'description')


class ActivityLogSerializer(serializers.ModelSerializer):
    username = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user')
    activity = ActivitySerializer()

    class Meta:
        model = ActivityLog
        fields = ('id', 'username', 'activity', 'duration', 'distance', 'calories', 'timestamp')

    def create(self, validated_data):
        activity_data = validated_data.pop('activity')
        activity, _ = Activity.objects.get_or_create(**activity_data)
        activity_log = ActivityLog.objects.create(activity=activity, **validated_data)
        return activity_log

class EnrollmentsSerializer(serializers.ModelSerializer):
    username = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    training_id = serializers.PrimaryKeyRelatedField(queryset=Training.objects.all())  

    class Meta:
        model = Enrollments
        fields = ('id','training_id','username')
        
    def create(self, validated_data):
        username = validated_data.get('username')
        training_id = validated_data.get('training_id')
        enrollment = Enrollments(username=username, training_id=training_id)
        enrollment.save()
        return enrollment
