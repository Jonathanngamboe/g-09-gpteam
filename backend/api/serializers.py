from rest_framework import serializers
from .models import  Booking, Property, Property_Type, Amenity, Status, Image, City, Review, Message, CustomUser

# class UserSerializer(serializers.HyperlinkedModelSerializer):
#    class Meta:
#        model = User
#        fields = ['url', 'username', 'email','first_name','last_name', 'groups']

class CustomUserSerializer(serializers.ModelSerializer):  
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email','first_name','last_name', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'is_owner', 'is_client', 'date_joined', 'last_login']

class BookingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Booking
        fields = ['url', 'check_in', 'check_out', 'created_at', 'property', 'user']

# class PropertySerializer(serializers.HyperlinkedModelSerializer):
#    class Meta:
#        model = Property
#        fields = ['url', 'title', 'description', 'address', 'price_per_night', 'surface', 'is_active', 'created_at', 'updated_at', 'owner']

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['id', 'title', 'description', 'address', 'price_per_night', 'surface', 'is_active', 'created_at', 'updated_at', 'owner']


class Property_TypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Property_Type
        fields = ['url', 'name']

class AmenitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Amenity
        fields = ['url', 'name']

class StatusSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Status
        fields = ['url', 'name']

class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Image
        fields = ['url', 'image', 'property']

class CitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = City
        fields = ['url', 'name', 'zip']

class ReviewSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Review
        fields = ['url', 'rating', 'comment', 'created_at', 'property', 'user']

class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = ['url', 'sender', 'receiver', 'content', 'created_at', 'status' ]
