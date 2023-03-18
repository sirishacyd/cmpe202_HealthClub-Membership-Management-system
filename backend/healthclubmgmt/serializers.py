from rest_framework import serializers
from .models import Training


#Training Model Serializer
class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = ('id', 'instructor_name', 'training_type', 'start_time', 'end_time', 'max_capacity', 'location', 'current_capacity')