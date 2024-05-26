# Generated by Django 5.0.4 on 2024-05-17 08:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0002_remove_amenity_properties"),
    ]

    operations = [
        migrations.AlterField(
            model_name="unavailability",
            name="comment",
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name="unavailability",
            name="property",
            field=models.ForeignKey(
                default=None,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="unavailabilities",
                to="api.property",
            ),
        ),
    ]