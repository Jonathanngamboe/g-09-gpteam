from rest_framework import serializers
from .models import  Booking, Property, PropertyType, Amenity, Status, Image, City, Review, Message, CustomUser, Unavailability
from django.db.models import Avg

class CustomUserSerializer(serializers.HyperlinkedModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )
    class Meta:
        model = CustomUser
        fields = ['url', 'id', 'username', 'email', 'first_name', 'last_name', 'groups', 'date_of_birth', 'date_joined', 'last_login', 'profil_image', 'address', 'city']

class BookingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Booking
        fields = ['url', 'id', 'check_in', 'check_out', 'created_at', 'status', 'property', 'user']

class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Image
        fields = ['url', 'id', 'image_url', 'ext_url']

class CitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = City
        fields = ['url', 'name', 'zip']

class AmenitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Amenity
        fields = ['url', 'name']

class UnavailabilitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Unavailability
        fields = ['url', 'id', 'start_date', 'end_date', 'comment', 'property']

class PropertySerializer(serializers.HyperlinkedModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    city = CitySerializer(read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    unavailabilities = UnavailabilitySerializer(many=True, read_only=True)
    bookings = BookingSerializer(many=True, read_only=True)
    class Meta:
        model = Property
        fields = ['id', 'url', 'title', 'description', 'address', 'city', 'price_per_night', 'surface', 'is_active', 'created_at', 'updated_at', 'owner', 'images', 'average_rating', 'amenities', 'unavailabilities', 'bookings']

    def get_average_rating(self, obj):
        average = Review.objects.filter(booking__property=obj).aggregate(Avg('rating'))
        return average['rating__avg'] if average['rating__avg'] is not None else 0

class PropertyTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PropertyType
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
        fields = ['url', 'id', 'subject', 'body', 'sent_at', 'booking']


