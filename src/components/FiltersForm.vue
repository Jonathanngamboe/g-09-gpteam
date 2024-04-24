<template>
  <div class="filters-container">
    <q-input
      filled
      v-model="filters.location"
      label="Location"
      lazy-rules
      :rules="[val => !!val || 'Field is required']"
    />
    <q-space />
    <!-- Price range filter -->
    <div class="price-range-selector">
      <label for="price-range">Price Range</label>
      <q-range
        id="price-range"
        v-model="filters.priceRange"
        :min="priceRange.min"
        :max="priceRange.max"
        :label-value="labelValue"
      />
      <div class="row justify-between q-mt-xs">
        <q-input filled v-model.number="filters.priceRange.min" label="Minimum" type="number" />
        <q-input filled v-model.number="filters.priceRange.max" label="Maximum" type="number" />
      </div>
    </div>
    <q-space />
    <!-- Amenities selector -->
    <label for="amenities">Amenities</label>
    <q-select
      filled
      v-model="filters.amenities"
      label="Select Amenities"
      multiple
      :options="amenitiesOptions"
      option-value="value"
      option-label="label"
      emit-value
      map-options
    />
    <div>
      <label for="rating-slider">Minimum Rating</label>
      <q-slider id="rating-slider" filled v-model="filters.rating" :min="1" :max="5" />
    </div>
    <q-btn unelevated color="primary" label="Apply Filters" @click="applyFilters" />
    <q-btn unelevated color="grey" label="Reset" @click="resetFilters" />
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue';

export default defineComponent({
  emits: ['on-filter', 'on-reset'],

  setup(props, { emit }) {
    const priceRange = ref({ min: 50, max: 2000 });
    const amenitiesOptions = [
      { label: 'Wi-Fi', value: 'Wi-Fi' },
      { label: 'Piscine', value: 'Pool' },
    ];

    const filters = ref({
      location: '',
      priceRange: { min: 50, max: 2000 },
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
        priceRange: { min: 50, max: 2000 },
        amenities: [],
        rating: 3
      };
      emit('on-reset');
    };

    return {
      filters,
      amenitiesOptions,
      applyFilters,
      resetFilters,
      labelValue,
      priceRange
    };
  }
});
</script>

<style scoped>
.filters-container {
  padding: 30px;
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.price-range-selector label {
  display: block;
}
</style>