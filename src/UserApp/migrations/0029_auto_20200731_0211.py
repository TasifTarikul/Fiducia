# Generated by Django 2.1.5 on 2020-07-31 02:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserApp', '0028_auto_20200731_0200'),
    ]

    operations = [
        migrations.AlterField(
            model_name='journey',
            name='depart_area_name',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='journey',
            name='depart_date',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='journey',
            name='destination_area_name',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='journey',
            name='destination_date',
            field=models.DateField(null=True),
        ),
    ]
