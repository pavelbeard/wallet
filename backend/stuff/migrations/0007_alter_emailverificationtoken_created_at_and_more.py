# Generated by Django 5.1.2 on 2024-12-04 13:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stuff', '0006_emailverificationtoken_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emailverificationtoken',
            name='created_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='passwordresettoken',
            name='created_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]