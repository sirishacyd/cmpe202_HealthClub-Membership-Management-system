from django.db import models



    
class Training(models.Model):
    training_id = models.AutoField(primary_key=True)
    instructor_name = models.CharField(max_length=255)
    training_type = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    max_capacity = models.PositiveIntegerField()
    #location = models.ForeignKey(Location, on_delete=models.CASCADE)

    def __str__(self):
        return self.training_type

class Activity(models.Model):
    id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=255)

    def __str__(self):
        return self.type

class ActivityLog(models.Model):
    user_id = models.IntegerField()
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='activity_logs')
    duration = models.IntegerField()
    distance = models.FloatField()
    calories = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.activity} - {self.user_id} - {self.timestamp}"