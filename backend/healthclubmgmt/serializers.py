from rest_framework import serializers
from .models import Training,User_log, Location,User
# from django.contrib.auth.models import User


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
