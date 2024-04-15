from django.db import models

class Message(models.Model):
    subject = models.CharField(max_length=200)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Room(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.FloatField()
    location = models.CharField(max_length=200)

    def __str__(self):
        return self.title
