from django.apps import AppConfig
from django.utils import timezone


class HealthclubmgmtConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'healthclubmgmt'
    
    def ready(self):
        from healthclubmgmt.models import Training
        now = timezone.now()
        old_trainings = Training.objects.filter(end_time__lt=now)
        old_trainings.delete()
 
    
    
