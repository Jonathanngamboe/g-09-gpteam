from django.contrib import admin

from .models import Message, Property, CustomUser, Property_Type, Amenity, Image, City, Booking, Review, Status


@admin.register(CustomUser)
class UserModelAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'date_joined', 'get_groups')
    list_filter = ('date_joined', 'last_login')
    search_fields = ('first_name', 'last_name', 'email', 'get_groups')

    def get_groups(self, obj):
        return ', '.join([group.name for group in obj.groups.all()])

@admin.register(Property)
class PropertyModelAdmin(admin.ModelAdmin):
    list_display = ('title', 'price_per_night', 'surface', 'is_active', 'owner', 'city')
    list_filter = ('price_per_night', 'surface', 'is_active')
    search_fields = ('title', 'description', 'address')


@admin.register(Property_Type)
class TypeModelAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Amenity)
class AmenitiesModelAdmin(admin.ModelAdmin):
    list_display=('name',)

@admin.register(Image)
class ImageModelAdmin(admin.ModelAdmin):
    list_display=('id', 'image_url')

@admin.register(City)
class CityModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'zip')

@admin.register(Booking)
class BookingModelAdmin(admin.ModelAdmin):
    list_display = ('check_in', 'check_out', 'created_at')
    list_filter = ('check_in', 'check_out', 'created_at')
    search_fields = ('check_in', 'check_out')

@admin.register(Review)
class ReviewModelAdmin(admin.ModelAdmin):
    list_display = ('rating', 'comment', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('rating', 'created_at')

@admin.register(Status)
class StatusModelAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Message)
class MessageModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'sent_at')
    list_filter = ('sent_at',)
    search_fields = ('subject', 'body')
    