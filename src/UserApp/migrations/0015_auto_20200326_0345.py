# Generated by Django 2.1.5 on 2020-03-26 03:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('UserApp', '0014_auto_20200326_0336'),
    ]

    operations = [
        migrations.RenameField(
            model_name='negotiate',
            old_name='ngotiator_price',
            new_name='negotiator_price',
        ),
    ]
