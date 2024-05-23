<template>
    <q-select
      borderless
      :label="label"
      :placeholder="placeholder"
      v-model="selectedCity"
      :options="filterCities"
      option-value="url"
      option-label="name"
      hide-dropdown-icon
      clearable
      use-input
      input-debounce="300"
      @filter="filterFunction"
      :disable="disable"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  import citiesService from '@/services/citiesService';
  
  export default {
    props: {
        modelValue: {
            type: Object,
            default: () => ({ name: '', url: '' }) 
        },
        disable: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: 'City'
        },
        placeholder: {
            type: String,
            default: ''
        },
    },
    emits: ['update:modelValue', 'search'],
    setup(props, { emit }) {
        const selectedCity = ref({ ...props.modelValue }); 
        const cities = ref([]);
        const filterCities = ref([]);
    
        const fetchCities = async () => {
            const result = await citiesService.getAllCities();
            cities.value = result.map(city => ({
                name: city.name,
                url: city.url  
            }));
            selectedCity.value = { ...props.modelValue };
        };

        const filterFunction = (val, update, abort) => {
            if (!val || val.length < 2) {
                abort();
                return;
            }
            update(() => {
                const needle = val.toLowerCase();
                filterCities.value = cities.value.filter(city => city.name.toLowerCase().includes(needle));
            });
        };

        // Watcher to update parent's modelValue when selectedCity changes
        watch(selectedCity, (newValue) => {
            emit('update:modelValue', newValue);
        }, { deep: true });


        // Initialize cities on component mount
        onMounted(fetchCities);
    
        return { selectedCity, cities, filterCities, filterFunction };
    }
  }
  </script>
  