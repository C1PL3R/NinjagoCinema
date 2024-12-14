from django.db import models

class Movie(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50, null=True)
    description = models.TextField(null=True)
    url_for_segments = models.URLField(max_length=200, null=True)
    main_photo_url = models.URLField(max_length=200, null=True)
    minutes = models.IntegerField(null=True)
    is_published = models.BooleanField(null=True)

    def __str__(self):
        return self.title
    
    
class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, unique=True)
    login = models.EmailField(max_length=20, unique=True)
    password = models.CharField(max_length=500)
    is_admin = models.BooleanField()

    def __str__(self):
        return self.email