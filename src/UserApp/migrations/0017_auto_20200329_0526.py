# Generated by Django 2.1.5 on 2020-03-29 05:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserApp', '0016_auto_20200327_0516'),
    ]

    operations = [
        migrations.AddField(
            model_name='negotiate',
            name='final_price',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='negotiate',
            name='negotiation_status',
            field=models.CharField(blank=True, choices=[('active', 'Active'), ('accepted_by_negotiator', 'Accepted by Negotiator'), ('accepted_by_orderer', 'Accepted by Orderer'), ('rejected', 'Rejected'), ('cancelled', 'Cancelled')], max_length=50, null=True),
        ),
    ]
