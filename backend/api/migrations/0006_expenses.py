# Generated by Django 5.1.6 on 2025-03-15 04:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_donation_animal_needs_review'),
    ]

    operations = [
        migrations.CreateModel(
            name='Expenses',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('usd_amount', models.IntegerField()),
            ],
        ),
    ]
