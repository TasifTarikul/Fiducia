# Generated by Django 2.1.5 on 2020-02-23 05:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserApp', '0004_journeyorders'),
    ]

    operations = [
        migrations.AlterField(
            model_name='journey',
            name='journey_status',
            field=models.CharField(blank=True, choices=[('active', 'Active'), ('complete', 'Complete'), ('cancelled', 'Cancelled')], max_length=50, null=True),
        ),
    ]
