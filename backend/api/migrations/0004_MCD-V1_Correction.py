# Generated by Django 5.0.4 on 2024-04-28 13:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_MCD-V1'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='image',
            name='property',
        ),
        migrations.AddField(
            model_name='property',
            name='amenities',
            field=models.ManyToManyField(to='api.amenity'),
        ),
        migrations.AddField(
            model_name='property',
            name='city',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='properties', to='api.city'),
        ),
        migrations.AddField(
            model_name='property',
            name='images',
            field=models.ManyToManyField(to='api.image'),
        ),
        migrations.AddField(
            model_name='property',
            name='property_Type',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='properties', to='api.property_type'),
        ),
        migrations.AddField(
            model_name='user',
            name='groups',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='users', to='api.group'),
        ),
    ]
