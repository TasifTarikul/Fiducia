# Generated by Django 2.1.5 on 2020-03-25 16:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('UserApp', '0012_auto_20200324_0726'),
    ]

    operations = [
        migrations.AlterField(
            model_name='negotiate',
            name='journey',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='negotiates', to='UserApp.Journey'),
        ),
    ]
