# Generated by Django 3.0.14 on 2022-01-19 01:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20220118_1437'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='searchHeight',
            new_name='searchOutseam',
        ),
        migrations.RenameField(
            model_name='profile',
            old_name='searchWeight',
            new_name='searchWaist',
        ),
    ]
