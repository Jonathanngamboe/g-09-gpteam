<template>
  <div class="q-pa-md room-grid">
    <!-- Using a v-for loop to iterate over a list of rooms -->
    <div v-for="room in rooms" :key="room.id">
      <RoomCard :room="room" @toggle-expanded="toggleExpanded"/>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick, defineComponent } from 'vue';
import RoomCard from '@/components/RoomCard.vue'; 

export default defineComponent( {
  components: {
    RoomCard
  },
  
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
        rating: 2,
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
        rating: 3,
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
        rating: 5,
        expanded: false
      },
    ]);

    function toggleExpanded(roomId) {
      const room = rooms.value.find(r => r.id === roomId);
      if (room) {
        room.expanded = !room.expanded;
      }
    }

    // Helper function to equalize title heights
    const equalizeTitleHeights = () => {
      nextTick(() => {
        const titles = Array.from(document.querySelectorAll('.text-h5'));
        const maxHeight = Math.max(...titles.map(el => el.clientHeight));
        titles.forEach(el => el.style.height = `${maxHeight}px`);
      });
    };
    // Use mounted lifecycle hook to call the function after the component is mounted
    onMounted(() => {
      equalizeTitleHeights();
      window.addEventListener('resize', equalizeTitleHeights);
    });
    // Cleanup the event listener when the component is unmounted
    onBeforeUnmount(() => {
      window.removeEventListener('resize', equalizeTitleHeights);
    });

    return {
      rooms,
      toggleExpanded,
    };
  }
});
</script>

<style scoped>
/* Define a grid layout with a fixed minimum column width */
.room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Create a responsive number of grid columns */
  gap: 16px; /* This sets the gap between cards */
}

.room-grid > div {
  display: flex; /* Use flex layout for the grid item to control the card height */
}

/* Define a media query for very small screens where cards should take full width */
@media (max-width: 599px) {
  .room-grid {
    grid-template-columns: 1fr; /* One card per row on small screens */
  }
}
</style>