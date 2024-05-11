from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.core.validators import MinValueValidator
from django.core.validators import MaxValueValidator

class CustomUser(AbstractUser):
    date_of_birth = models.DateField(blank=True, null=True)
    email = models.EmailField(blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    profil_image = models.ImageField(upload_to='profil_image/', default='profil_image/default.jpg', blank=True)

class Property(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50)
    description = models.TextField()
    address = models.CharField(max_length=100)
    city = models.ForeignKey('City', on_delete=models.CASCADE, related_name='properties', null=True, default=None)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.00)])
    surface = models.PositiveIntegerField(validators=[MaxValueValidator(999)])
    amenities = models.ManyToManyField('Amenity')
    property_Type = models.ForeignKey ('Property_Type', on_delete=models.CASCADE, related_name='properties', null=True, default=None)
    images = models.ManyToManyField('Image')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    #owner = models.TextField()
class Property_Type(models.Model):
    name = models.CharField(max_length=50, primary_key=True)

class Amenity(models.Model):
    name = models.CharField(max_length=100, primary_key=True)

class Image(models.Model):
    id = models.AutoField(primary_key=True)
    image = models.ImageField(upload_to='property_image/', blank=True, null=True)
    ext_url = models.URLField(null=True, blank=True)

class City(models.Model):
    name = models.CharField(max_length=50, primary_key=True)
    zip = models.CharField(max_length=10)

class Booking(models.Model):
    id = models.AutoField(primary_key=True)
    check_in = models.DateField()   #Start date
    check_out = models.DateField()  #End date
    created_at = models.DateTimeField(auto_now_add=True)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

class Review(models.Model):
    id = models.AutoField(primary_key=True)
    rating = models.PositiveIntegerField(validators=[MaxValueValidator(5), MinValueValidator(0)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

class Status(models.Model):
    name = models.CharField(max_length=50, primary_key=True)

class Message(models.Model):
    id = models.AutoField(primary_key=True)
    subject = models.CharField(max_length=200)
    body = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)