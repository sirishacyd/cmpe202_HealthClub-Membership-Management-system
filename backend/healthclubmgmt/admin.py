from django.contrib import admin
from .models import Training


class TrainingAdmin(admin.ModelAdmin):
    list_display = ('training_id','training_type','instructor_name','start_time','end_time','max_capacity')
    
# Register your models here. 
admin.site.register(Training,TrainingAdmin)