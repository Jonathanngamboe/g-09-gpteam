<template>
  <q-dialog v-model="visible" :position="dialogPosition">
    <div class="filters-container">
      <q-bar class="full-width bg-white text-primary">
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>        
      </q-bar>
      <!-- Property type filter -->
      <div class="type-filter q-mb-md">
        <label for="type-filter">Property Type</label>
        <q-select
          v-model="tempFilters.propertyType"
          :options="allTypesOptions"
          label="Type"
          emit-value
          map-options
          dense
        />
      </div>
      <!-- Price range filter -->
      <div class="price-range-selector">
        <label for="price-range">Price Range</label>
        <q-range
          color="primary"
          id="price-range"
          v-model="tempFilters.priceRange"
          :min="filters.priceRange.min"
          :max="filters.priceRange.max"
          :label-value="labelValue"
        />
        <div class="price-inputs row justify-between q-mt-xs" style="align-items: center">
          <q-input
            filled
            v-model.number="tempFilters.priceRange.min"
            label="Minimum"
            type="number"
          />
          <span class="separator">-</span>
          <q-input
            filled
            v-model.number="tempFilters.priceRange.max"
            label="Maximum"
            type="number"
          />
        </div>
      </div>

      <q-space />

      <!-- Amenities selector -->
      <div class="amenities-checkboxes" v-if="displayedAmenities.length > 0">
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
          <q-btn flat rounded label="More" @click="toggleShowAllAmenities" v-if="!showAllAmenities.value && amenitiesLength.value > 9" />
          <q-btn flat rounded label="Less" @click="toggleShowAllAmenities" v-else-if="showAllAmenities.value"/>
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
              <q-icon v-if="ratingModel.min === 0" size="xs" color="primary" name="star_outline" />

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
import { ref, reactive, computed, defineComponent, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import amenitiesService from '../services/amenitiesService';
import { filters, clearFilters } from '../utils/globalState';
import propertyTypesService from '../services/propertyTypesService';

export default defineComponent({
  emits: ["on-filter", "on-reset", "toggle-filters", "update:isVisible"],

  props: {
    isVisible: Boolean
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const dialogPosition = computed(() => $q.screen.lt.md ? 'bottom' : 'standard');
    const allAmenitiesOptions = ref([]);
    const amenitiesLength = ref(0);
    let cachedAmenities = [];
    const allTypesOptions = ref([]);

    const visible = computed({
      get: () => props.isVisible,
      set: (val) => emit("update:isVisible", val)
    })

    // Copy of filters to store temporary changes before applying
    const tempFilters = reactive({
      priceRange: { ...filters.priceRange },
      amenities: [...filters.amenities],
      rating: { ...filters.rating },
      propertyType: filters.propertyType
    });

    // Reactive property for ratingModel
    const ratingModel = ref({ min: filters.min || 0, max: filters.max || 5 });

    // Reactive property to control the display of all amenities
    const showAllAmenities = ref(false)

    // Full list of amenities
    const fetchAmenities = async () => {
      if(cachedAmenities.length > 0) {
        allAmenitiesOptions.value  = [...cachedAmenities];
        return;
      } else {
        try {
          const response = await amenitiesService.getAllAmenities();
          const amenities = response.map(amenity => amenity.name);
          allAmenitiesOptions.value = [...amenities];
          amenitiesLength.value = amenities.length;
          cachedAmenities = [...amenities];
        } catch (error) {
          allAmenitiesOptions.value = [];
          $q.notify({
            message: error.response.data.message || 'Failed to load amenities from the server',
            color: 'negative',
            position: 'top',
            icon: 'error'
          });
        }
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await propertyTypesService.getAllPropertyTypes();
        allTypesOptions.value = response.map(type => ({ label: type.name, value: type.name }));
      } catch (error) {
        allTypesOptions.value = [];
        $q.notify({
          message: error.response.data.message || 'Failed to load property types from the server',
          color: 'negative',
          position: 'top',
          icon: 'error'
        });
      }
    }

    onMounted(() => {
      fetchAmenities();
      fetchTypes();
    });

    // Computed list of amenities based on toggle
    const displayedAmenities = computed(() => {
      return showAllAmenities.value ? allAmenitiesOptions : allAmenitiesOptions.value.slice(0, 9);
    });

    // Method to update selected amenities
    const updateAmenities = (amenity, isChecked) => {
      const index = tempFilters.amenities.indexOf(amenity)
      if (isChecked && index === -1) {
        tempFilters.amenities.push(amenity)
      } else if (!isChecked && index !== -1) {
        tempFilters.amenities.splice(index, 1)
      }
    }

    // Computed property for displaying price range label
    const labelValue = computed(() => {
      return `${filters.priceRange.min} - ${filters.priceRange.max}`
    })

    // Method to apply filters
    const applyFilters = () => {
      Object.assign(filters, {
        priceRange: { ...tempFilters.priceRange },
        amenities: [...tempFilters.amenities],
        rating: { ...ratingModel.value },
        propertyType: tempFilters.propertyType
      })
      emit("on-filter", filters)
      emit("toggle-filters")
    }

    // Method to reset filters to default
    const resetFilters = () => {
      clearFilters()
      // Reset tempFilters as well
      Object.assign(tempFilters, {
        priceRange: { ...filters.priceRange },
        amenities: [],
        rating: ratingModel.value,
        propertyType: ''
      })
      ratingModel.value = { min: 0, max: 5 }
      emit("on-reset")
      emit("toggle-filters")
    }

    // Method to toggle visibility of all amenities
    const toggleShowAllAmenities = () => {
      showAllAmenities.value = !showAllAmenities.value
    }

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
      tempFilters,
      visible,
      amenitiesLength,
      allTypesOptions
    };
  }
})
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

.price-inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* adjust gap as needed */
}

.price-inputs .q-input {
  flex: 1 1 100%; /* Make input fields full width on small screens */
}

.separator {
  flex-basis: 100%; /* Force separator to next line on small screens */
  text-align: center; /* Center separator text */
}

@media (min-width: 600px) {
  /* Adjust media query threshold as needed */
  .price-inputs .q-input {
    flex: 1 1 auto; /* Allow inputs to grow and shrink as needed */
  }

  .separator {
    flex-basis: auto; /* Keep separator on the same line as inputs on larger screens */
  }
}
</style>
