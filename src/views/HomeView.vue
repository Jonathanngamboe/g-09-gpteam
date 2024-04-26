<template>
  <!-- Filters button -->
  <div class="q-pa-md q-gutter-md row justify-end">
    <q-btn unelevated outline label="Filters" @click="toggleFilters" icon="tune"/>
  </div>
  <FiltersDialog
    :isVisible="filtersVisible"
    @update:isVisible="val => filtersVisible = val"
    @on-filter="onFilter"
    @on-reset="onReset"
    @close="filtersVisible = false"
  />

  <!-- Room Cards -->
  <div :class="{'room-container': filteredRooms.length === 0}">
    <div class="q-pa-md room-grid">
      <!-- Condition to check if there are no rooms after filtering -->
      <div v-if="filteredRooms.length === 0">
        <div class="no-results">
          <q-icon name="search_off" size="100px" color="grey-5" />
          <div>No rooms found. Please adjust your filters.</div>
        </div>
      </div>
      <div v-else v-for="room in filteredRooms" :key="room.id">
        <RoomCard :room="room" @toggle-expanded="toggleExpanded"/>
      </div>
    </div>
  
    <HelloWorld msg="Welcome to Your Vue.js App." />
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, defineComponent, computed } from 'vue';
import RoomCard from '@/components/RoomCard.vue'; 
import FiltersDialog from '@/components/FiltersDialog.vue';;




export default defineComponent( {
  components: {
    RoomCard,
    FiltersDialog,
    
  },
  
  setup() {
    // Filters logic
    const filtersVisible = ref(false);
    const filtersApplied = ref(false);

    const filters = reactive({
      location: '',
      priceRange: { min: 0, max: Infinity },
      amenities: [],
      rating: { min: 0, max: 5 }
    });

    const onReset = () => {
      Object.assign(filters, {
        location: '',
        priceRange: { min: 0, max: Infinity },
        amenities: [],
        rating: 0
      });
      filtersVisible.value = false;
      filtersApplied.value = false; 
    };

    const onFilter = newFilters => {
      Object.assign(filters, newFilters);
      filtersVisible.value = false;
      filtersApplied.value = true; 
    };

    const toggleFilters = () => {
      filtersVisible.value = !filtersVisible.value;
    };

    // Computed property to filter rooms based on active filters
    const filteredRooms = computed(() => {
      if (!filtersApplied.value) {
        return allRooms.value; // Return all rooms if no filters are applied
      }
      return allRooms.value.filter(room => {
        const locationMatch = !filters.location || room.location.toLowerCase().includes(filters.location.toLowerCase());
        const priceMatch = room.price >= filters.priceRange.min && room.price <= filters.priceRange.max;
        const amenitiesMatch = filters.amenities.length === 0 || filters.amenities.every(amenity => room.amenities.includes(amenity));
        const ratingMatch = room.rating >= filters.rating.min && room.rating <= filters.rating.max;
        return locationMatch && priceMatch && amenitiesMatch && ratingMatch;
      });
    });

    // TODO: Replace with the actual list of rooms
    const allRooms = ref([
      {
        id: 1,
        image: 'https://cdn.quasar.dev/img/parallax1.jpg',
        location: 'Venice',
        title: 'Beautiful Room with a View',
        description: 'Detailed information about the room...',
        surfaceArea: 55,
        price: 100,
        amenities: ['Wi-Fi', 'Parking', 'Balcony', 'Kitchen'],
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
        amenities: ['Netflix', 'Wi-Fi', 'Parking', 'Kitchen'],
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
        amenities: ['Balcony', 'Kitchen', 'Fireplace'],
        rating: 5,
        expanded: false
      },
    ]);

    // Function to toggle the description visibility
    function toggleExpanded(roomId) {
      const room = allRooms.value.find(r => r.id === roomId);
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
      filteredRooms,
      toggleExpanded,
      toggleFilters,
      filtersVisible,
      onFilter,
      onReset
    };
  },
  data() {
    return {
      showModal: false
    };
  }
});
</script>

<style scoped>
.room-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh; /* Ensures centering is effective in an empty grid */
}

/* Define a grid layout with a fixed minimum column width */
.room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Create a responsive number of grid columns */
  gap: 16px; /* This sets the gap between cards */
}

.room-grid > div {
  display: flex; /* Use flex layout for the grid item to control the card height */
}

.no-results {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.no-results q-icon {
  font-size: 100px;
  color: grey;
}

/* Define a media query for very small screens where cards should take full width */
@media (max-width: 599px) {
  .room-grid {
    grid-template-columns: 1fr; /* One card per row on small screens */
  }
}
</style>