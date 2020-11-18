# Generated by Django 2.1.5 on 2020-03-22 01:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('UserApp', '0009_auto_20200227_0117'),
    ]

    operations = [
        migrations.CreateModel(
            name='Negotiate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.CharField(blank=True, max_length=100, null=True)),
                ('journey', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='UserApp.Journey')),
            ],
        ),
    ]