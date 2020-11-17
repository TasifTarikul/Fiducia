# Generated by Django 2.1.5 on 2020-02-22 13:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('UserApp', '0003_journey_journey_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='JourneyOrders',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='UserApp.Order')),
                ('traveller', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='UserApp.Journey')),
            ],
        ),
    ]
