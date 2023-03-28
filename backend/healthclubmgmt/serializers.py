from rest_framework import serializers
from .models import Training,User_log, Location,User
# from django.contrib.auth.models import User
from .models import Training
from .models import Activity, ActivityLog, User



#Training Model Serializer
class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = ('id', 'instructor_name', 'training_type', 'start_time', 'end_time', 'max_capacity', 'location', 'current_capacity')


class UserLogSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    location_id = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all())

    class Meta:
        model = User_log
        fields = ('id', 'user_id', 'checkin_time', 'checkout_time', 'location_id')

    def create(self, validated_data):
        user_id = validated_data.get('user_id')
        checkin_time = validated_data.get('checkin_time')
        location_id = validated_data.get('location_id')

        user_log = User_log(user_id=user_id, checkin_time=checkin_time, location_id=location_id)
        user_log.save()
        return user_log
        
class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ('id', 'name', 'description')


class ActivityLogSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user')
    activity = ActivitySerializer()

    class Meta:
        model = ActivityLog
        fields = ('id', 'user_id', 'activity', 'duration', 'distance', 'calories', 'timestamp')

    def create(self, validated_data):
        activity_data = validated_data.pop('activity')
        activity, _ = Activity.objects.get_or_create(**activity_data)
        activity_log = ActivityLog.objects.create(activity=activity, **validated_data)
        return activity_log
