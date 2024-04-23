<template>
  <div class="q-pa-md room-grid">
    <!-- TODO : Add filters and lazy loading -->
    <!-- Using a v-for loop to iterate over a list of rooms -->
    <div v-for="room in rooms" :key="room.id">      
      <q-card flat bordered>
        <!-- Room image -->
        <q-img :src="room.image" />

        <!-- Card content -->
        <q-card-section>
          <div class="text-overline text-secondary">{{ room.location }}</div>
          <div class="text-h5 q-mt-sm q-mb-xs">{{ room.title }}</div>
          <div class="text-subtitle1 q-mb-xs">{{ room.surfaceArea }} m²</div>
          <div class="text-h7 text-dark q-mb-xs">From CHF {{ room.price }}.-</div>
          <div class="text-caption text-grey">
            {{ formatAmenities(room.amenities) }}
          </div>
        </q-card-section>

        <!-- Card actions -->
        <q-card-actions>
          <q-btn flat round color="red" icon="favorite" />
          <q-btn flat round color="primary" icon="share" />
          <q-btn flat color="primary" label="Book" />
          
          <q-space />

          <!-- Toggling the detailed view for each card -->
          <q-btn
            color="grey"
            round
            flat
            dense
            :icon="room.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            @click="toggleExpanded(room)"
          />
        </q-card-actions>

        <!-- Slide transition for detailed view -->
        <q-slide-transition>
          <div v-show="room.expanded">
            <q-separator />
            <q-card-section class="text-subtitle2">
              {{ room.description }}
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup() {
    // TODO: Replace with the actual list of rooms
    const rooms = ref([
      {
        id: 1,
        image: 'https://cdn.quasar.dev/img/parallax1.jpg',
        location: 'Venice',
        title: 'Beautiful Room with a View',
        description: 'Detailed information about the room...',
        surfaceArea: 55,
        price: 100,
        amenities: ['Bed', '1 bath', '1 TV', 'Wi-Fi'],
        expanded: false
      },
      {
        id: 2,
        image: 'https://cdn.quasar.dev/img/parallax2.jpg',
        location: 'New York',
        title: 'Cozy Apartment in the Heart of the City',
        description: 'Detailed information about the room...',
        surfaceArea: 20,
        price: 120,
        amenities: ['Pool', 'Gym', 'Wi-Fi', 'Parking', 'Balcony', 'Kitchen'],
        expanded: false
      },
      {
        id: 3,
        image: 'https://cdn.quasar.dev/img/mountains.jpg',
        location: 'Martigny',
        title: 'Mountain Chalet with a Stunning View',
        description: 'Detailed information about the room...',
        surfaceArea: 35,
        price: 920,
        amenities: ['Pool', 'Gym', 'Wi-Fi', 'Parking', 'Balcony', 'Kitchen'],
        expanded: false
      },
    ]);

    function toggleExpanded(room) {
      room.expanded = !room.expanded;
    }

    // Helper function to format amenities
    const formatAmenities = (amenities) => {
      const maxVisibleAmenities = 3; // Limit of visible amenities
      const visibleAmenities = amenities.slice(0, maxVisibleAmenities).join(' · ');
      return amenities.length > maxVisibleAmenities
        ? `·${visibleAmenities} and ${amenities.length - maxVisibleAmenities} more`
        : visibleAmenities;
    };

    return {
      rooms,
      toggleExpanded,
      formatAmenities
    };
  }
}
</script>

<style>
/* Define a grid layout with a fixed minimum column width */
.room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Create a responsive number of grid columns */
  gap: 16px; /* This sets the gap between cards */
}

.room-grid > div {
  display: flex; /* Use flex layout for the grid item to control the card height */
}

.q-card {
  width: 100%; /* Make sure the card stretches to fill the grid item */
  display: flex; /* Use flex layout for the card itself */
  flex-direction: column; /* Arrange card contents vertically */
}

.q-card-section {
  flex: 1; /* Allow card section to expand to fill available space */
}

.q-img {
  height: auto; /* Set image height to auto to maintain aspect ratio */
  max-height: 200px; /* Set a max height for images */
  width: 100%; /* Set image width to fill card width */
  object-fit: cover; /* Cover ensures the image covers the area, might crop */
}

/* Define a media query for very small screens where cards should take full width */
@media (max-width: 599px) {
  .room-grid {
    grid-template-columns: 1fr; /* One card per row on small screens */
  }
}
</style>