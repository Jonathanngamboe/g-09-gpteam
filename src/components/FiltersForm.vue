<template>
  <div class="filters-container">
    <q-input
      filled
      v-model="filters.location"
      label="Location"
      lazy-rules
      :rules="[val => !!val || 'Field is required']"
    />
    <q-input
      type="number"
      filled
      v-model.number="filters.price"
      label="Max Price"
      lazy-rules
      :rules="[val => val >= 0 || 'Price must be positive']"
    />
    <q-select
      filled
      v-model="filters.amenities"
      label="Amenities"
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
import { ref, defineComponent } from 'vue';

export default defineComponent({
  emits: ['on-filter', 'on-reset'],

  setup(props) {
    const amenitiesOptions = [
      { label: 'Wi-Fi', value: 'Wi-Fi' },
      { label: 'Pool', value: 'Pool' },
    ];

    const filters = ref({
      location: '',
      price: null,
      amenities: [],
      rating: 1
    });

    const applyFilters = () => {
      props.onFilter(filters.value); // Trigger the event to notify the parent component
    };

    const resetFilters = () => {
      filters.value = {
        location: '',
        price: null,
        amenities: [],
        rating: 1
      };
      props.onReset(); // Trigger the event to notify the parent component
    };

    return {
      filters,
      amenitiesOptions,
      applyFilters,
      resetFilters
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
</style>
