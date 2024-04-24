<template>
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
        :min="priceRange.min"
        :max="priceRange.max"
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
            :model-value="filters.amenities.includes(amenity)"
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
</template>

<script>
import { ref, computed, defineComponent } from 'vue';

export default defineComponent({
  emits: ['on-filter', 'on-reset'],

  setup(props, { emit }) {
    const priceRange = ref({ min: 1, max: 2000 });

    const updateAmenities = (amenity, checked) => {
      const index = filters.amenities.indexOf(amenity);
      if (checked && index === -1) {
        filters.amenities.push(amenity);
      } else if (!checked && index !== -1) {
        filters.amenities.splice(index, 1);
      }
    };

    const toggleShowAllAmenities = () => {
      showAllAmenities.value = !showAllAmenities.value;
    };

    const showAllAmenities = ref(false);

    const allAmenitiesOptions = ref([
      'Wi-Fi',
      'Parking',
      'Kitchen',
      'Air conditioning',
      'Breakfast',
      'Pool',
      'Gym',
      'Spa',
      'Pets allowed',
      'Wheelchair accessible',
      'Elevator',
      'Balcony',
      'Beachfront',
      'Mountain view',
      'City view',
      'Garden view',
      'Terrace',
      'Fireplace',
      'Bathtub',
      'Sauna',
      'Jacuzzi',
      'TV',
      'Netflix',
      'Amazon Prime',
    ]);

    const displayedAmenities = computed(() => {
      return showAllAmenities.value ? allAmenitiesOptions.value : allAmenitiesOptions.value.slice(0, 9);
    });

    const filters = ref({
      location: '',
      priceRange: { min: 1, max: 2000 },
      amenities: [],
      rating: 3
    });

    const labelValue = computed(() => {
      return `${filters.value.priceRange.min}€ - ${filters.value.priceRange.max}€`;
    });

    const applyFilters = () => {
      emit('on-filter', filters.value);
    };

    const resetFilters = () => {
      filters.value = {
        location: '',
        priceRange: { min: 1, max: 2000 },
        amenities: [],
        rating: 3
      };
      emit('on-reset');
    };

    const ratingModel = ref({ min: 0, max: 5 });

    return {
      filters,
      displayedAmenities,
      updateAmenities,
      toggleShowAllAmenities,
      showAllAmenities,
      applyFilters,
      resetFilters,
      labelValue,
      priceRange,
      ratingModel
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