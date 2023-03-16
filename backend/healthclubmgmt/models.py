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
