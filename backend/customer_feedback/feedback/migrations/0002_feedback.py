# Generated by Django 4.2.17 on 2025-01-09 12:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('feedback_type', models.CharField(choices=[('Complaint', 'Complaint'), ('Suggestion', 'Suggestion'), ('Praise', 'Praise')], max_length=50)),
                ('comments', models.TextField()),
                ('sentiment', models.CharField(blank=True, max_length=50)),
                ('tags', models.CharField(blank=True, max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
