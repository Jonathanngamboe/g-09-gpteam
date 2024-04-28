from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from rest_framework import viewsets, permissions
from .models import  Booking, Property, Property_Type, Amenity, Status, Image, City, Review, Message
from .serializers import   BookingSerializer, PropertySerializer, Property_TypeSerializer, AmenitySerializer, StatusSerializer, ImageSerializer, CitySerializer, ReviewSerializer, MessageSerializer

# Serve Vue Application
index_view = never_cache(TemplateView.as_view(template_name='index.html'))


class BookingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows bookings to be viewed or edited.
    """
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

class PropertyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows properties to be viewed or edited.
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

class Property_TypeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows property types to be viewed or edited.
    """
    queryset = Property_Type.objects.all()
    serializer_class = Property_TypeSerializer
    permission_classes = [permissions.IsAuthenticated]

class AmenityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows amenities to be viewed or edited.
    """
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [permissions.IsAuthenticated]

class StatusViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows statuses to be viewed or edited.
    """
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    permission_classes = [permissions.IsAuthenticated]

class ImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows images to be viewed or edited.
    """
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [permissions.IsAuthenticated]

class CityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows cities to be viewed or edited.
    """
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [permissions.IsAuthenticated]

class ReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows reviews to be viewed or edited.
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

class MessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
