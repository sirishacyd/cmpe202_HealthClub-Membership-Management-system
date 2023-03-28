from django.db import models
import datetime
from datetime import date


class Location(models.Model):
    location_id = models.AutoField(primary_key=True)
    location_name = models.CharField(max_length=255)
    location_address = models.CharField(max_length=255)

    def __str__(self):
        return self.location_name


class Training(models.Model):
    training_id = models.AutoField(primary_key=True)
    instructor_name = models.CharField(max_length=255)
    training_type = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    max_capacity = models.PositiveIntegerField()
    current_capacity = models.IntegerField(default=0)
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.training_id)


class User(models.Model):
    USER_TYPE = [
        ('Member', 'Member'),
        ('Non-member', 'Non-member'),
        ('Admin', 'Admin'),
    ]
    user_id = models.EmailField(max_length=255, primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=10)
    user_type = models.CharField(max_length=10, choices=USER_TYPE)
    trial_expiry = models.DateField(blank=True, null=True)
    password = models.CharField(max_length=25, blank=True)

    def save(self, *args, **kwargs):
        if self.user_type == self.USER_TYPE[1][0] and self.trial_expiry == None:
            expiry = date.today()
            expiry += datetime.timedelta(days=30)
            self.trial_expiry = expiry
        else: 
            self.trial_expiry = None
        if self.password == "":
            self.password = "default_password!"
        
        super().save()
            

    def __str__(self):
        return self.user_id


class User_log(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    checkin_time = models.DateTimeField()
    checkout_time = models.DateTimeField(blank=True, null=True)
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user_id}"


class Activity(models.Model):
    id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=255)

    def __str__(self):
        return self.type


class ActivityLog(models.Model):
    user_id = models.ForeignKey('User', on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='activity_logs')
    duration = models.IntegerField()
    distance = models.FloatField()
    calories = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.activity} - {self.user_id} - {self.timestamp}"


class Enrollments(models.Model):
    training_id = models.ForeignKey(Training, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    training_type = models.CharField(max_length=255, blank=True, null=True)
    

    def __str__(self):
        return self.training_type
    
    def save(self,*args,**kwargs):
        if self.training_type is None or self.training_type == "":
            self.training_type = self.training_id.training_type
        super(Enrollments, self).save(*args,**kwargs)
        

    def __str__(self):
        return f"{self.training_id} - {self.user_id}"

    class Meta:
        verbose_name = 'Enrollment'
        verbose_name_plural = 'Enrollments'
