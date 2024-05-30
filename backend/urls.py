"""djangoHeroku URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.conf.urls.static import static
from django.conf import settings
from .api.views import index_view, MessageViewSet, BookingViewSet, PropertyViewSet, PropertyTypeViewSet, AmenityViewSet, ImageViewSet, CityViewSet, ReviewViewSet, StatusViewSet, CustomUserViewSet, UnavailabilityViewSet, current_user, send_emails

router = routers.DefaultRouter()
router.register('customusers', CustomUserViewSet)
router.register('messages', MessageViewSet)
router.register('bookings', BookingViewSet)
router.register('properties', PropertyViewSet)
router.register('property-types', PropertyTypeViewSet)
router.register('amenities', AmenityViewSet)
router.register('images', ImageViewSet)
router.register('cities', CityViewSet)
router.register('reviews', ReviewViewSet)
router.register('statuses', StatusViewSet)
router.register('unavailabilities', UnavailabilityViewSet)

urlpatterns = [
    path('api/customusers/me/', current_user, name='current-user'),
    path('api/send-email/', send_emails, name='send-email'),
    path('api/properties/<int:pk>/add-image/', PropertyViewSet.as_view({
        'post': 'add_image_to_property'
    }), name='add-image-to-property'),
                  # http://localhost:8000/
    path('', index_view, name='index'),

    # http://localhost:8000/api/<router-viewsets>
    path('api/', include(router.urls)),

    path('api/explorer/', include('rest_framework.urls', namespace='rest_framework')),

    path('api/dj-rest-auth/', include('dj_rest_auth.urls')),
    path('api/dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),

    #path('api/properties/add/', add_property_view, name='add-property'),
    #path('api/properties/<int:id>/edit/', edit_property_view, name='edit-property'),
    #path('api/properties/<int:id>/delete/', delete_property_view, name='delete-property'),
    #path('api/properties/<int:id>/book/', book_property_view, name='book-property'),
    
    
    
    # http://localhost:8000/api/admin/
    path('api/admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) # https://docs.djangoproject.com/en/5.0/howto/static-files/#serving-files-uploaded-by-a-user-during-development
