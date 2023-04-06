from django.db import models
import datetime
from datetime import date
from django.contrib.auth.models import User as ContribUser
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password



class Location(models.Model):
    location_id = models.AutoField(primary_key=True)
    location_name = models.CharField(max_length=255)
    location_address = models.CharField(max_length=255)

    def __str__(self):
        return str(self.location_id)


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

class User(ContribUser):
    USER_TYPE = [
        ('Member', 'Member'),
        ('Non-member', 'Non-member'),
        ('Admin', 'Admin'),
    ]

    phone = models.CharField(max_length=10)
    user_type = models.CharField(max_length=10, choices=USER_TYPE)
    trial_expiry = models.DateField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.isNonMember() and self.trial_expiry == None:
            expiry = date.today()
            expiry += datetime.timedelta(days=30)
            self.trial_expiry = expiry
            self.set_unusable_password()
        else: 
            if not self.has_usable_password():
                self.password= make_password("default_password!")
            elif not self.check_password(self.password): 
                self.set_password(self.password)
            self.trial_expiry = None

        if validate_email(self.username) != None: 
            raise ValidationError("username needs to be an email ID")
        else:
            self.email = self.username

        if self.user_type == self.USER_TYPE[2][0]:
            self.is_staff = True
        
        super().save()
            
    def isNonMember(self):
        if self.user_type == self.USER_TYPE[1][0]:
            return True
        return False

    def __str__(self):
        return self.username


class User_log(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    checkin_time = models.DateTimeField()
    checkout_time = models.DateTimeField(blank=True, null=True)
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.username}"


class Activity(models.Model):
    id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=255)

    def __str__(self):
        return self.type


class ActivityLog(models.Model):
    username = models.ForeignKey('User', on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='activity_logs')
    duration = models.IntegerField()
    distance = models.FloatField()
    calories = models.FloatField()
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.activity} - {self.username} - {self.timestamp}"


class Enrollments(models.Model):
    training_id = models.ForeignKey(Training, on_delete=models.CASCADE)
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    training_type = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.training_type

    def save(self,*args,**kwargs):
        if self.training_type is None or self.training_type == "":
            self.training_type = self.training_id.training_type
        super(Enrollments, self).save(*args,**kwargs)

    # def __str__(self):
    #     return f"{self.training_id} - {self.username}"
    
    class Meta:
        verbose_name = 'Enrollment'
        verbose_name_plural = 'Enrollments'
