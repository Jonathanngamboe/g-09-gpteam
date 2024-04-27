from rest_framework import serializers
from .models import User, Group, Booking, Property, Property_Type, Amenity, Status, Image, City, Review, Message

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']

class BookingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Booking
        fields = ['url', 'check_in', 'check_out', 'created_at', 'property', 'user']

class PropertySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Property
        fields = ['url', 'title', 'description', 'address', 'price_per_night', 'surface', 'is_active', 'created_at', 'updated_at', 'owner']

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


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = ['url', 'sender', 'receiver', 'content', 'created_at', 'status' ]
