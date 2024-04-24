<template>
  <q-dialog v-model="isVisible" :position="dialogPosition">
    <div class="filters-container">

      <!-- Location search filter -->
      <div class="location-search">
        <label for="location">Location</label>
        <q-input
          filled
          v-model="filters.location"
          label="Search for a destination"
          lazy-rules
        />
      </div>

      <q-space />

      <!-- Price range filter -->
      <div class="price-range-selector">
        <label for="price-range">Price Range</label>
        <q-range
          color="primary"
          id="price-range"
          v-model="filters.priceRange"
          :min="1"
          :max="2000"
          :label-value="labelValue"
        />
        <div class="row justify-between q-mt-xs" style="align-items: center;">
          <q-input filled v-model.number="filters.priceRange.min" label="Minimum" type="number" />
          -
          <q-input filled v-model.number="filters.priceRange.max" label="Maximum" type="number" />
        </div>
      </div>

      <q-space />

      <!-- Amenities selector -->
      <div class="amenities-checkboxes">
        <label>Amenities</label>
        <div class="amenities-list">
          <div v-for="amenity in displayedAmenities" :key="amenity" class="amenity-item">
            <q-checkbox
              :label="amenity"
              :value="amenity"
              :model-value="tempFilters.amenities.includes(amenity)"
              @update:model-value="updateAmenities(amenity, $event)"
            />
          </div>
        </div>
        <div class="row justify-center">
          <q-btn flat rounded label="More" @click="toggleShowAllAmenities" v-if="!showAllAmenities" />
          <q-btn flat rounded label="Less" @click="toggleShowAllAmenities" v-else />
        </div>  
      </div>

      <q-space />

      <!-- Rating range with star icons -->
      <div class="rating-range-selector">
        <label for="rating">Rating Range</label>
        <q-range
          v-model="ratingModel"
          color="primary"
          :left-thumb-color="ratingModel.min === 0 ? 'black' : 'primary'"
          :right-thumb-color="ratingModel.max === 5 ? 'black' : 'primary'"
          snap
          :min="0"
          :max="5"
          :step="0.5"
          marker-labels
        >
          <template v-slot:marker-label-group="{ markerMap }">
            <div
              class="row items-center no-wrap"
              :class="markerMap[ratingModel.min].classes"
              :style="markerMap[ratingModel.min].style"
            >
              <q-icon
                v-if="ratingModel.min === 0"
                size="xs"
                color="primary"
                name="star_outline"
              />

              <template v-else>
                <q-icon
                  v-for="i in Math.floor(ratingModel.min)"
                  :key="i"
                  size="xs"
                  color="primary"
                  name="star_rate"
                />

                <q-icon
                  v-if="ratingModel.min > Math.floor(ratingModel.min)"
                  size="xs"
                  color="primary"
                  name="star_half"
                />
              </template>
            </div>

            <div
              class="row items-center no-wrap"
              :class="markerMap[ratingModel.max].classes"
              :style="markerMap[ratingModel.max].style"
            >
              <q-icon
                v-for="i in Math.floor(ratingModel.max)"
                :key="i"
                size="xs"
                color="primary"
                name="star_rate"
              />

              <q-icon
                v-if="ratingModel.max > Math.floor(ratingModel.max)"
                size="xs"
                color="primary"
                name="star_half"
              />
            </div>
          </template>
        </q-range>
      </div>

      <q-space />

      <!-- Apply and Reset buttons -->
      <q-btn unelevated rounded color="primary" label="Apply Filters" @click="applyFilters" />
      <q-btn unelevated rounded flat label="Reset" @click="resetFilters" />
    </div>
  </q-dialog>
</template>

<script>
import { ref, reactive, computed, defineComponent } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  emits: ['on-filter', 'on-reset', 'toggle-filters'],

  props: {
    isVisible: Boolean
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const dialogPosition = computed(() => $q.screen.lt.md ? 'bottom' : 'standard');

    const filters = reactive({
      location: '',
      priceRange: { min: 1, max: 2000 }, 
      amenities: [],
      rating: { min: 0, max: 5 }
    });

    // Copy of filters to store temporary changes before applying
    const tempFilters = reactive({
    location: filters.location,
    priceRange: { ...filters.priceRange },
    amenities: [...filters.amenities],
    rating: { ...filters.rating }
  });

    // Reactive property for ratingModel
    const ratingModel = ref({
      min: 0, // Initial minimum rating
      max: 5  // Initial maximum rating
    });

    // Reactive property to control the display of all amenities
    const showAllAmenities = ref(false);

    // Full list of amenities
    const allAmenitiesOptions = [
      'Wi-Fi', 'Parking', 'Kitchen', 'Air conditioning', 'Breakfast',
      'Pool', 'Gym', 'Spa', 'Pets allowed', 'Wheelchair accessible',
      'Elevator', 'Balcony', 'Beachfront', 'Mountain view', 'City view',
      'Garden view', 'Terrace', 'Fireplace', 'Bathtub', 'Sauna',
      'Jacuzzi', 'TV', 'Netflix', 'Amazon Prime',
    ];

    // Computed list of amenities based on toggle
    const displayedAmenities = computed(() => {
      return showAllAmenities.value ? allAmenitiesOptions : allAmenitiesOptions.slice(0, 9);
    });

    // Method to update selected amenities
    const updateAmenities = (amenity, isChecked) => {
      const index = tempFilters.amenities.indexOf(amenity);
      if (isChecked && index === -1) {
        tempFilters.amenities.push(amenity);
      } else if (!isChecked && index !== -1) {
        tempFilters.amenities.splice(index, 1);
      }
    };

    // Computed property for displaying price range label
    const labelValue = computed(() => {
      return `${filters.priceRange.min} - ${filters.priceRange.max}`;
    });

    // Method to apply filters
    const applyFilters = () => {
      Object.assign(filters, {
        location: tempFilters.location,
        priceRange: { ...tempFilters.priceRange },
        amenities: [...tempFilters.amenities],
        rating: { ...tempFilters.rating }
      });
      emit('on-filter', filters);
      emit('toggle-filters');
    };

    // Method to reset filters to default
    const resetFilters = () => {
      filters.location = '';
      filters.priceRange = { min: 1, max: 2000 };
      filters.amenities = [];
      filters.rating = ratingModel.value.min;
      // Reset tempFilters as well
      Object.assign(tempFilters, {
        location: '',
        priceRange: { min: 1, max: 2000 },
        amenities: [],
        rating: { min: 0, max: 5 }
      });
      emit('on-reset');
      emit('toggle-filters');
    };

    // Method to toggle visibility of all amenities
    const toggleShowAllAmenities = () => {
      showAllAmenities.value = !showAllAmenities.value;
    };

    return {
      filters,
      displayedAmenities,
      updateAmenities,
      toggleShowAllAmenities,
      showAllAmenities,
      applyFilters,
      resetFilters,
      labelValue,
      ratingModel,
      dialogPosition,
      tempFilters
    };
  }
});
</script>

<style scoped>
.filters-container {
  padding: 50px;
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.amenities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.amenity-item {
  flex: 1;
  min-width: 120px;
}

</style>