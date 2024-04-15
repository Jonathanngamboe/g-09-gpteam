from django.contrib import admin

from .models import Message, Room

@admin.register(Message)
class MessageModelAdmin(admin.ModelAdmin):
    list_display = ('pk', 'subject', 'created_at', 'updated_at')
    list_filter = ('created_at',)
    search_fields = ('subject', 'body')

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'price')
    list_filter = ('price',)
    search_fields = ('title', 'location')
    