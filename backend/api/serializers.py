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
        fields = '__all__'

class BookingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'

class CitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = City
        fields = '__all__'

class AmenitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'

class PropertySerializer(serializers.HyperlinkedModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    city = CitySerializer(read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    class Meta:
        model = Property
        fields = '__all__'

    def get_average_rating(self, obj):
        average = Review.objects.filter(booking__property=obj).aggregate(Avg('rating'))
        return average['rating__avg'] if average['rating__avg'] is not None else 0

class PropertyTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PropertyType
        fields = '__all__'

class StatusSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'

class ReviewSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class UnavailabilitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Unavailability
        fields = '__all__'
