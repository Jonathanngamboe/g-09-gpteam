from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from rest_framework import viewsets, permissions, status
from .models import Booking, Property, PropertyType, Amenity, Status, Image, City, Review, Message, CustomUser, Unavailability
from .serializers import   BookingSerializer, PropertySerializer, PropertyTypeSerializer, AmenitySerializer, StatusSerializer, ImageSerializer, CitySerializer, ReviewSerializer, MessageSerializer, CustomUserSerializer, UnavailabilitySerializer
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.core.mail import EmailMessage, get_connection
from backend.settings import base
from django.http import JsonResponse
from django.db.models import OuterRef, Exists, Avg, Q
from django.utils.dateparse import parse_date
from django.views.decorators.http import require_http_methods
from django.utils.datastructures import MultiValueDictKeyError
from django.shortcuts import get_object_or_404

from copy import deepcopy
import json
import re


# Serve Vue Application
index_view = never_cache(TemplateView.as_view(template_name='index.html'))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Retrieve the currently logged in user.
    """
    serializer = CustomUserSerializer(request.user, context={'request': request})
    return Response(serializer.data)

@require_http_methods(["POST"])
def send_emails(request):
    try:
        data = json.loads(request.body.decode('utf-8'))  
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        if not email or not subject or not message:
            return JsonResponse({'status': 'error', 'message': 'Missing email, subject, or message in the request'})

        with get_connection(
            host=base.EMAIL_HOST,
            port=base.EMAIL_PORT,
            username=base.EMAIL_HOST_USER,
            password=base.EMAIL_HOST_PASSWORD,
            use_tls=base.EMAIL_USE_TLS
        ) as connection:
            recipients = email.split()  
            email_msg = EmailMessage(subject, message, base.EMAIL_HOST_USER, recipients, connection=connection)
            email_msg.send()

        return JsonResponse({'status': 'success', 'message': 'Email sent successfully'})

    except json.JSONDecodeError:
        print('Invalid JSON data')
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'})
    except Exception as e:
        print(f'SMTP error: {str(e)}')
        return JsonResponse({'status': 'error', 'message': f'SMTP error: {str(e)}'})

class CustomUserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows custom users to be viewed or edited.
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Restrict non-staff users to only access their own user object
        if self.request.user.is_staff:
            return CustomUser.objects.all()
        else:
            return CustomUser.objects.filter(id=self.request.user.id)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)  # Show validation errors in the console
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_update(serializer)
        return Response(serializer.data)



class BookingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows bookings to be viewed or edited.
    """
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='user-bookings/(?P<user_id>\d+)')
    def user_bookings(self, request, user_id=None):
        """
        Retrieve all bookings for a specific user.
        """
        user = get_object_or_404(CustomUser, pk=user_id)
        bookings = self.queryset.filter(user=user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='room-bookings/(?P<room_id>\d+)')
    def room_bookings(self, request, room_id=None):
        """
        Retrieve all bookings for a specific room.
        """
        room = get_object_or_404(Property, pk=room_id)
        bookings = self.queryset.filter(property=room)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    # Update the status of a booking by providing the booking ID and the status name
    @action(detail=False, methods=['post'], url_path='update-status')
    def update_status(self, request):
        try:
            booking_id = request.data['bookingId']
            status_name = request.data['statusName']
        except KeyError:
            return Response({'error': 'Missing booking ID or status name'}, status=status.HTTP_400_BAD_REQUEST)

        booking = get_object_or_404(Booking, pk=booking_id)
        status = get_object_or_404(Status, name=status_name)
        booking.status = status
        booking.save()
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    def reformat_date(self, date_str):
        return date_str.replace('/', '-')
    
    def extract_id_from_url(self, url):
            match = re.search(r'properties/(\d+)/$', url)
            return match.group(1) if match else None
    
    def extract_status_name_from_url(self, url):
        match = re.search(r'statuses/(\w+)/$', url)
        return match.group(1) if match else None

    def create(self, request, *args, **kwargs):
        mutable_data = deepcopy(request.data)

        # Extract and validate the status
        try:
            status_name = self.extract_status_name_from_url(mutable_data['status'])
        except KeyError:
            return Response({'error': 'Missing status URL'}, status=status.HTTP_400_BAD_REQUEST)
        print("Status name:", status_name)

        if not status_name:
            return Response({'error': 'Invalid status URL'}, status=status.HTTP_400_BAD_REQUEST)

        status_obj = Status.objects.filter(name=status_name).first()
        if not status_obj:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate the dates
        try:
            mutable_data['check_in'] = self.reformat_date(mutable_data['check_in'])
            mutable_data['check_out'] = self.reformat_date(mutable_data['check_out'])
        except MultiValueDictKeyError:
            return Response({'error': 'Missing check-in or check-out dates'}, status=status.HTTP_400_BAD_REQUEST)

        check_in_date = parse_date(mutable_data['check_in'])
        check_out_date = parse_date(mutable_data['check_out'])
        if not (check_in_date and check_out_date):
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the property
        property_id = self.extract_id_from_url(mutable_data['property'])
        if not property_id:
            return Response({'error': 'Invalid property URL'}, status=status.HTTP_400_BAD_REQUEST)

        if not self.is_available(property_id, check_in_date, check_out_date):
            return Response({'error': 'Property is not available for the selected dates', 'details': 'Existing booking conflicts with the requested dates'}, status=status.HTTP_400_BAD_REQUEST)

        request._full_data = mutable_data  # Update the request data
        return super().create(request, *args, **kwargs)

    def is_available(self, property_id, check_in, check_out):
        existing_bookings = Booking.objects.filter(
            property_id=property_id,
            check_out__gte=check_in,
            check_in__lte=check_out
        )
        unavailabilities = Unavailability.objects.filter(
            property_id=property_id,
            end_date__gte=check_in,
            start_date__lte=check_out
        )
        # If there are any bookings or unavailabilities that overlap the requested dates, return False
        return not (existing_bookings.exists() or unavailabilities.exists())

class PropertyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows properties to be viewed or edited.
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Retrieve query parameters
        destination = self.request.query_params.get('destination', None)
        check_in = self.request.query_params.get('checkIn', None)
        check_out = self.request.query_params.get('checkOut', None)
        min_price = self.request.query_params.get('minPrice', None)
        max_price = self.request.query_params.get('maxPrice', None)
        amenities_param = self.request.query_params.get('amenities', '')
        min_rating = self.request.query_params.get('minRating', None)
        max_rating = self.request.query_params.get('maxRating', None)

        # Filter by destination
        if destination:
            queryset = queryset.filter(city__name__icontains=destination)
        
        # Filter by availability
        if check_in and check_out:
            check_in_date = parse_date(check_in)
            check_out_date = parse_date(check_out)
            if not check_in_date or not check_out_date:
                raise ValidationError("Invalid check-in or check-out date format")

            booking_subquery = Booking.objects.filter(
                property=OuterRef('pk'),
                check_out__gte=check_in_date,
                check_in__lte=check_out_date
            )
            
            unavailability_subquery = Unavailability.objects.filter(
                property=OuterRef('pk'),
                end_date__gte=check_in_date,
                start_date__lte=check_out_date
            )

            queryset = queryset.exclude(
                Exists(booking_subquery) | Exists(unavailability_subquery)
            )

        # Filter by price
        if min_price and max_price:
            queryset = queryset.filter(price_per_night__gte=min_price, price_per_night__lte=max_price)

        # Filter by amenities
        if amenities_param:
            amenities_list = [amenity.strip() for amenity in amenities_param.split(',')]
            if amenities_list:
                for amenity in amenities_list:
                    queryset = queryset.filter(amenities__name__iexact=amenity)

        # Filter by rating
        if min_rating is not None or max_rating is not None:
            queryset = queryset.annotate(
                average_rating=Avg('booking__review__rating')
            )
            
            # Initialize the rating conditions
            rating_conditions = Q()

            # Conditions for including properties without reviews
            if min_rating is not None and float(min_rating) == 0:
                include_no_reviews = Q(average_rating__isnull=True)
            else:
                include_no_reviews = Q()

            # Conditions when min_rating is provided
            if min_rating is not None:
                rating_conditions |= (Q(average_rating__gte=min_rating) | include_no_reviews)
            
            # Conditions for max_rating
            if max_rating is not None:
                rating_conditions &= (Q(average_rating__lte=max_rating) | include_no_reviews)

            # Apply the combined rating conditions to the queryset
            queryset = queryset.filter(rating_conditions)

        return queryset.distinct()

class PropertyTypeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows property types to be viewed or edited.
    """
    queryset = PropertyType.objects.all()
    serializer_class = PropertyTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

class AmenityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows amenities to be viewed or edited.
    """
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

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
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows reviews to be viewed or edited.
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class MessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

class UnavailabilityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows unavailabilities to be viewed or edited.
    """
    queryset = Unavailability.objects.all()
    serializer_class = UnavailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
# def add_property_view(request):
#    if request.method == 'POST':
#        property_data = request.POST  
#        try:
#            new_property = propertyService.addProperty(property_data)
#            return JsonResponse({'success': True, 'message': 'Property added successfully', 'property': new_property})
#        except Exception as e:
#            return JsonResponse({'success': False, 'error': str(e)})
#    else:
#        return JsonResponse({'success': False, 'error': 'Only POST requests are allowed for this endpoint'}, status=405)
