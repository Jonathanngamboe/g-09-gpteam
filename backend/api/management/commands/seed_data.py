from django.core.management.base import BaseCommand

from backend.api.models import User, Group, Property_Type, Amenity, City, Image,  Property, Booking, Review


class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **options):
        seed_data()
        self.stdout.write(self.style.SUCCESS('Data successfully seeded'))

def seed_data():
    # Create groups
    homeowner_group = Group.objects.create(name='Homeowner')
    students_group = Group.objects.create(name='Student')
    administrator = Group.objects.create(name='Administrator')
    
    # Create users
    johnDoe_user = User.objects.create(firstname='John', lastname='Doe', date_of_birth='1990-01-01', email='john@example.com', password='password', profil_image='profil_image/default.jpg', groups=homeowner_group)
    janeDoe_user = User.objects.create(firstname='Jane', lastname='Doe', date_of_birth='1990-01-01', email='jane@example.com', password='password', profil_image='profil_image/default.jpg', groups=students_group)

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
    property1 = Property.objects.create(title='House in Venice', description='Beautiful house in Venice', address='Venice', price_per_night=100.00, surface=100, is_active=True, owner=johnDoe_user, property_Type=house)
    property1.amenities.add(wifi)
    property1.amenities.add(parking)
    property1.amenities.add(kitchen)
    property1.amenities.add(airCondition)
    property1.city=venice
    property1.images.add(image1)
    property1.images.add(image2)
    property1.save()

    property2 = Property.objects.create(title='Apartment in Paris', description='Beautiful apartment in Paris', address='Paris', price_per_night=200.00, surface=50, is_active=True, owner=johnDoe_user, property_Type=apartement)
    property2.amenities.add(parking)
    property2.amenities.add(kitchen)
    property2.city=paris
    property2.images.add(image1)
    property2.images.add(image2)
    property2.save()

    # Create bookings
    booking1 = Booking.objects.create(check_in='2021-01-01', check_out='2021-01-10', property=property1, user=janeDoe_user)
    booking2 = Booking.objects.create(check_in='2021-02-01', check_out='2021-02-10', property=property2, user=janeDoe_user)
    booking1.save()
    booking2.save()
