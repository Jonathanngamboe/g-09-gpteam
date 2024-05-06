from rest_framework import serializers
from .models import  Booking, Property, Property_Type, Amenity, Status, Image, City, Review, Message, CustomUser
from django.db.models import Avg

class CustomUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email','first_name','last_name', 'is_active', 'is_staff', 'is_superuser', 'is_owner', 'is_client', 'date_joined', 'last_login', 'address', 'city', 'profil_image']

class BookingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'check_in', 'check_out', 'created_at', 'property', 'user', 'status']


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Image
        fields = ['url', 'id', 'property']

class CitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = City
        fields = ['url', 'name', 'zip']

class AmenitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Amenity
        fields = ['url', 'id', 'name', 'properties']

class PropertySerializer(serializers.HyperlinkedModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    city = CitySerializer(read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    class Meta:
        model = Property
        fields = ['id', 'url', 'title', 'description', 'address', 'city', 'price_per_night', 'surface', 'is_active', 'created_at', 'updated_at', 'owner', 'images', 'average_rating', 'amenities', 'property_Type']

    def get_average_rating(self, obj):
        average = Review.objects.filter(property=obj).aggregate(Avg('rating'))
        return average['rating__avg'] if average['rating__avg'] is not None else 0

class Property_TypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Property_Type
        fields = ['url', 'name']

class StatusSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Status
        fields = ['url', 'name']

class ReviewSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Review
        fields = ['url', 'id', 'rating', 'comment', 'created_at', 'booking']

class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = ['url', 'id', 'subject', 'body', 'sent_at', 'booking', 'sent_by', 'received_by' ]
