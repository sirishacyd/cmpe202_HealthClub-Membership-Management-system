from django.contrib import admin
from .models import Training,User,User_log,Activity,ActivityLog



class TrainingAdmin(admin.ModelAdmin):
    list_display = ('training_id','training_type','instructor_name','start_time','end_time','max_capacity','current_capacity')

class UserAdmin(admin.ModelAdmin):
    list_display=('user_id','first_name','last_name','user_type','trial_expiry')

class User_logAdmin(admin.ModelAdmin):
    list_display=('user_id','checkin_time','checkout_time')
    
# Register your models here. 
admin.site.register(Training,TrainingAdmin)
admin.site.register(User,UserAdmin)
admin.site.register(User_log,User_logAdmin)



