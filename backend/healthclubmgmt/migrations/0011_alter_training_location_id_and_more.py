# Generated by Django 4.1.1 on 2023-03-16 18:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('healthclubmgmt', '0010_training_location_id_user_log_location_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='training',
            name='location_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='healthclubmgmt.location'),
        ),
        migrations.AlterField(
            model_name='user_log',
            name='location_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='healthclubmgmt.location'),
        ),
    ]