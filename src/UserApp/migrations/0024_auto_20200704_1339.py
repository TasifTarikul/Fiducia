# Generated by Django 2.1.5 on 2020-07-04 13:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserApp', '0023_auto_20200701_0808'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='payment_status',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
