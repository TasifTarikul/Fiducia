# Generated by Django 2.1.5 on 2020-07-01 08:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('UserApp', '0022_auto_20200630_0653'),
    ]

    operations = [
        migrations.RenameField(
            model_name='payment',
            old_name='amount',
            new_name='delivery_price',
        ),
    ]
