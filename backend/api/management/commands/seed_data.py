from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group

from backend.api.models import CustomUser, Property_Type, Amenity, City, Image,  Property, Booking, Review


class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **options):
        seed_data()
        self.stdout.write(self.style.SUCCESS('Data successfully seeded'))

def seed_data():
    # Create groups
    homeowner = Group.objects.create(name='Homeowner')
    students = Group.objects.create(name='Student')
    administrator = Group.objects.create(name='Administrator')
    
    # Create users
    john_doe = CustomUser.objects.create(
        first_name='John',
        last_name='Doe',
        username='johndoe',
        password='password',
        date_of_birth='1990-01-01',
        email='john@example.com',
        profil_image='profil_image/default.jpg',
    )
    john_doe.groups.add(homeowner)
    jane_doe = CustomUser.objects.create(
        first_name='Jane', 
        last_name='Doe',
        username='janedoe',
        password='password', 
        date_of_birth='1990-01-01',
        email='jane@example.com', 
        profil_image='profil_image/default.jpg')
    jane_doe.groups.add(students)

    # Create property types
    house = Property_Type.objects.create(name='House')
    apartement = Property_Type.objects.create(name='Apartment')
    studio = Property_Type.objects.create(name='Studio')

    # Create amenities
    wifi = Amenity.objects.create(name='Wifi')
    parking = Amenity.objects.create(name='Parking')
    kitchen = Amenity.objects.create(name='Kitchen')
    airCondition = Amenity.objects.create(name='Air conditioning')
    breakfast = Amenity.objects.create(name='Breakfast')
    pool = Amenity.objects.create(name='Pool')
    gym = Amenity.objects.create(name='Gym')
    spa = Amenity.objects.create(name='Spa')
    petFriendly = Amenity.objects.create(name='Pet friendly')

    # Create cities
    venice = City.objects.create(name='Venice' , zip='30100')
    paris = City.objects.create(name='Paris' , zip='75000')
    newYork = City.objects.create(name='New York' , zip='10001')
    martigny = City.objects.create(name='Martigny', zip='1920') 

    # Create Images
    image1 = Image.objects.create(image='property_image/1.jpg')
    image2 = Image.objects.create(image='property_image/2.jpg')
    image3 = Image.objects.create(image='property_image/3.jpg')

    # Create properties
    property1 = Property.objects.create(title='House in Venice', description='Beautiful house in Venice', address='Venice', price_per_night=100.00, surface=100, is_active=True, owner=john_doe, property_Type=house)
    property1.amenities.add(wifi)
    property1.amenities.add(parking)
    property1.amenities.add(kitchen)
    property1.amenities.add(airCondition)
    property1.city=venice
    property1.images.add(image1)
    property1.images.add(image2)
    property1.save()

    property2 = Property.objects.create(title='Apartment in Paris', description='Beautiful apartment in Paris', address='Paris', price_per_night=200.00, surface=50, is_active=True, owner=john_doe, property_Type=apartement)
    property2.amenities.add(parking)
    property2.amenities.add(kitchen)
    property2.city=paris
    property2.images.add(image1)
    property2.images.add(image2)
    property2.save()

    # Create bookings
    booking1 = Booking.objects.create(check_in='2021-01-01', check_out='2021-01-10', property=property1, user=jane_doe)
    booking2 = Booking.objects.create(check_in='2021-02-01', check_out='2021-02-10', property=property2, user=jane_doe)
    booking1.save()
    booking2.save()
