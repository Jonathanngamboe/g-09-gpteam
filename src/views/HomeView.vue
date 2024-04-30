<template>
  <!-- Filters button -->
  <!--<div class="q-pa-md q-gutter-md row justify-end">
    <q-btn rounded unelevated outline label="Filters" @click="toggleFilters" icon="tune"/>
  </div>
  <FiltersDialog
    :isVisible="filtersVisible"
    @update:isVisible="(val) => (filtersVisible = val)"
    @on-filter="onFilter"
    @on-reset="onReset"
    @close="filtersVisible = false"
  />-->

  <!-- Room details for desktop -->
  <div v-if="!isMobile">
    <q-splitter v-model="splitterModel" :separator-style="separatorStyle">
      <!-- Room cards grid for desktop -->
      <template v-slot:before>
        <div :class="{'room-container': filteredRooms.length === 0}">
          <div class="q-pa-md room-grid">
            <div v-if="filteredRooms.length === 0">
              <div class="no-results">
                <q-icon name="search_off" size="100px" color="grey-5" />
                <div>No rooms found. Please adjust your filters.</div>
              </div>
            </div>
            <div v-else v-for="room in filteredRooms" :key="room.id">
              <RoomCard :room="room" @room-details="handleClickRoom"/>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:after v-if="selectedRoom">
        <q-btn flat round icon="close" class="close-btn" @click="closeDetails"/>
        <RoomCardDetail :room="selectedRoom"/>
      </template>
    </q-splitter>
  </div>
  <!-- Room cards grid for mobile -->
  <div v-else>
    <div :class="{'room-container': filteredRooms.length === 0}">
      <div class="q-pa-md room-grid">
        <div v-if="filteredRooms.length === 0">
          <div class="no-results">
            <q-icon name="search_off" size="100px" color="grey-5" />
            <div>No rooms found. Please adjust your filters.</div>
          </div>
        </div>
        <div v-else v-for="room in filteredRooms" :key="room.id">
          <RoomCard :room="room" @room-details="handleClickRoom"/>
        </div>
      </div>
    </div>
  </div>

  <!-- Room details dialog for mobile -->
  <q-dialog v-model="dialogVisible" v-if="isMobile" position="bottom" @update:model-value="handleDialogVisibilityChange">
    <RoomCardDetail :room="selectedRoom" />
  </q-dialog>

</template>

<script>
import { ref, watch, reactive, onMounted, onBeforeUnmount, nextTick, defineComponent, computed } from 'vue';
import RoomCard from '@/components/RoomCard.vue'; 
import FiltersDialog from '@/components/FiltersDialog.vue';
import RoomCardDetail from '@/components/RoomCardDetail.vue';
import { useQuasar } from 'quasar';
import roomService from '../services/roomService';
import reviewService from '../services/reviewService';  
import { all } from 'axios';

export default defineComponent({
  components: {
    RoomCard,
    FiltersDialog,
    RoomCardDetail
  },
  setup() {
    // Room details logic
    const $q = useQuasar();
    const isMobile = computed(() => $q.screen.lt.md);
    const dialogVisible = ref(false);
    const selectedRoom = ref(null);
    const splitterModel = ref(100);
    const allActiveRooms = ref([]);
    let cachedRooms = null;

    const fetchRooms = () => {
      if (cachedRooms) {
        allActiveRooms.value = cachedRooms;
      } else {
        roomService.getAllRooms()
          .then(data => {
            cachedRooms = data;
            // Do not import a room with missing data
            // data = data.filter(room => room.title && room.description && room.price_per_night && room.amenities && room.amenities.length > 0 && room.images && room.images.length > 0 && room.address && room.city);
            // Filter active rooms only
            allActiveRooms.value = data.filter(room => room.is_active);
            // Transform amenities into an array of names
            allActiveRooms.value.forEach(room => {
              room.amenities = room.amenities.map(amenity => amenity.name);
            });
          })
          .catch(err => {
            $q.notify({
              color: 'negative',
              position: 'top',
              message:  err.response || 'Failed to load rooms from the server', 
              icon: 'error'
            });
          });
      }
    };

    onMounted(fetchRooms);

    function handleClickRoom(roomId) {
      const room = allActiveRooms.value.find(r => r.id === roomId);
      if (room) {
        selectedRoom.value = room;
        if (isMobile.value) {
          dialogVisible.value = true;  // Open dialog on mobile
        } else {
          splitterModel.value = 30;  // Give 70% of the space to the room list, 30% to the details on desktop
        }      
      } else {
        $q.notify({
          message: 'Room not found. Please try again.',
          color: 'red-14',
          position: 'top',
          icon: 'error' 
        });
      }
    }

    function handleDialogVisibilityChange(newVal) {
      dialogVisible.value = newVal;
      if (!newVal) {
        closeDetails();  // This ensures all closing logic is handled
      }
    }

    // Switch between dialog and splitter based on screen size
    watch(isMobile, (newVal) => {
      if (selectedRoom.value) {
        if (newVal) {
          // Mobile: Show dialog if room is selected
          dialogVisible.value = true;
          splitterModel.value = 100;
        } else {
          // Desktop: Show splitter if room is selected
          dialogVisible.value = false;
          splitterModel.value = 30;
        }
      } else {
        splitterModel.value = 100;
        dialogVisible.value = false;
      }
    });

    watch(() => splitterModel.value, (newVal, oldVal) => {
      if (newVal === 90 && oldVal === 100) {
        splitterModel.value = 100;  // Quick fix to prevent the splitter from not being closed completely
      }
    });

    function closeDetails() {
      dialogVisible.value = false;
      selectedRoom.value = null;  // Reset selected room
      splitterModel.value = 100;  // Reset splitter position to hide the detail view
    }

    // Filters logic
    const filtersVisible = ref(false)
    const filtersApplied = ref(false)

    const filters = reactive({
      location: "",
      priceRange: { min: 0, max: Infinity },
      amenities: [],
      rating: { min: 0, max: 5 }
    })

    const onReset = () => {
      Object.assign(filters, {
        location: "",
        priceRange: { min: 0, max: Infinity },
        amenities: [],
        rating: 0
      })
      filtersVisible.value = false
      filtersApplied.value = false
    }

    const onFilter = (newFilters) => {
      Object.assign(filters, newFilters)
      filtersVisible.value = false
      filtersApplied.value = true
    }

    const toggleFilters = () => {
      filtersVisible.value = !filtersVisible.value
    }

    // Computed property to filter rooms based on active filters
    const filteredRooms = computed(() => {
      if (!filtersApplied.value) {
        return allActiveRooms.value // Return all rooms if no filters are applied
      }
      return allActiveRooms.value.filter(room => {
        const pricePerNightNumber = parseFloat(room.price_per_night); // Convertir en nombre
        const priceMatch = !isNaN(pricePerNightNumber) && pricePerNightNumber >= filters.priceRange.min && pricePerNightNumber <= filters.priceRange.max;
        const amenitiesMatch = filters.amenities.length === 0 || (Array.isArray(room.amenities) && filters.amenities.every(amenity => room.amenities.includes(amenity)));
        const ratingMatch = typeof room.average_rating === 'number' && room.average_rating >= filters.rating.min && room.average_rating <= filters.rating.max;
        return priceMatch && amenitiesMatch && ratingMatch;
      });
    });

    // Helper function to equalize title heights
    const equalizeTitleHeights = () => {
      nextTick(() => {
        const titles = Array.from(document.querySelectorAll(".text-h5"))
        const maxHeight = Math.max(...titles.map((el) => el.clientHeight))
        titles.forEach((el) => (el.style.height = `${maxHeight}px`))
      })
    }
    // Use mounted lifecycle hook to call the function after the component is mounted
    onMounted(() => {
      equalizeTitleHeights()
      window.addEventListener("resize", equalizeTitleHeights)
    })
    // Cleanup the event listener when the component is unmounted
    onBeforeUnmount(() => {
      window.removeEventListener("resize", equalizeTitleHeights)
    })

    return {
      allActiveRooms,
      filteredRooms,
      toggleFilters,
      filtersVisible,
      onFilter,
      onReset,
      handleClickRoom,
      selectedRoom,
      dialogVisible,
      isMobile,
      splitterModel,
      closeDetails,
      closeDetails,
      handleDialogVisibilityChange
    };
  },
  computed: {
  separatorStyle() {
    // Hide the separator when no room is selected and splitter is equal to 100
    return { display: this.selectedRoom && this.splitterModel !== 100 ? 'block' : 'none' };
    
  }
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
  grid-template-columns: repeat(
    auto-fit,
    minmax(300px, 1fr)
  ); /* Create a responsive number of grid columns */
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
