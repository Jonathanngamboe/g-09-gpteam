<template>
    <div class="row inline no-wrap q-pa-md">
        <!-- Search model buttons -->
        <q-btn-toggle
            v-model="searchModel"
            @update:model-value="handleModelClick"
            class="border-bottom"
            no-caps
            rounded
            unelevated
            toggle-color="primary"
            color="white"
            text-color="primary"
            :options="buttonOptions"
        >
        </q-btn-toggle>

        <!-- Menu for big screens -->
        <q-menu 
            fit 
            v-if="searchModel === 'destination' && $q.screen.gt.md"
            anchor="top left" 
            self="bottom left" 
            :offset="[0, 10]">
            <div class="row no-wrap q-pa-md">
                <div class="col">
                    <div class="row text-h6 q-gutter-sm items-center">
                        <q-icon name="place" class="q-mr-sm" />
                        <div>Search for a destination</div>
                    </div>
                    <q-select
                        dense
                        borderless
                        label="Destination"
                        placeholder="Where are you going?"
                        v-model="destination"
                        :options="filteredDestinations"
                        hide-dropdown-icon
                        clearable
                        use-input
                        fill-input
                        input-debounce="300"
                        @filter="filterFunction">
                        <template v-slot:append>
                            <q-btn flat round icon="search"  @click="performSearch"/>
                        </template>
                        <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">
                            No results
                            </q-item-section>
                        </q-item>
                        </template>
                    </q-select>
                </div>
            </div>
        </q-menu>
        <q-menu 
            v-if="searchModel === 'check-in' && $q.screen.gt.md"
            anchor="bottom middle" 
            self="top middle"
            :offset="[0, 10]">
            <q-date minimal v-model="dateRange.from" mask="YYYY-MM-DD" :options="dateOptions"/>
        </q-menu>
        <q-menu 
            v-if="searchModel === 'check-out' && $q.screen.gt.md"
            anchor="bottom right" 
            self="top middle" 
            :offset="[0, 10]">
            <q-date minimal v-model="dateRange.to" mask="YYYY-MM-DD" :options="dateOptions"/>
        </q-menu>
    </div>
    <!-- Search button for big screens -->
    <q-btn rounded unelevated color="primary" icon="search" class="border-bottom q-my-none full-height self-center" v-show="$q.screen.gt.md"  @click="performSearch"/>
    <!-- Popup dialog for small screens -->
    <q-dialog v-model="showPopup" position="top">
        <q-card class="border-bottom full-width dialog-card">
            <div class="row justify-end q-mt-md q-mr-md">
                <q-btn rounded flat @click="closePopup" color="negative" icon="close" />
            </div>
            <q-card-section class="text-h6 q-mx-lg row justify-start items-center" ><q-icon name="place" class="q-mr-md"/><strong>Search for a destination</strong></q-card-section>
            <q-card-section class="col q-ma-md">
                <q-select rounded outlined dense hide-dropdown-icon
                    v-model="destination"
                    label="Destination"
                    class="col q-mb-md"
                    :options="filteredDestinations"
                    use-input fill-input input-debounce="300"
                    @filter="filterFunction"
                    placeholder="Where are you going?"
                />                
                <q-input rounded outlined type="date" dense
                    v-model="dateRange.from" label="Check-in" class="col" :min="minDate" :rules="checkInRulesCustom"/>
                <q-input rounded outlined type="date" dense
                    v-model="dateRange.to" label="Check-out" class="col" :min="minCheckoutDate" :rules="checkOutRulesCustom"/>
            </q-card-section>
            <q-card-actions class="row justify-between q-mx-lg q-my-md">
                <q-btn rounded unelevated label="Clear" @click="clearFields"/>
                <q-btn rounded unelevated color="primary" icon="search" @click="performSearch"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import citiesService from '@/services/citiesService';
import { getMinCheckoutDate, getDateOptions } from '@/utils/dateUtils';
import { setSearchCriteria, clearSearchCriteria } from '@/utils/globalState';

export default {
    setup() {
        const $q = useQuasar();
        const searchModel = ref('');
        const showPopup = ref(false);
        const destination = ref(null);

        const availableDestinations = ref([null]);
        const fetchCities = async () => {
            const cities = await citiesService.getAllCities();
            availableDestinations.value = cities.map(city => city.name);
        };
        onMounted(fetchCities);
        
        const filteredDestinations = ref([...availableDestinations.value]); 

        const dateRange = ref({ from: null, to: null });
        const unavailableDates = ref([]);
        const today = new Date();
        const minDate = ref(today.toISOString().split('T')[0]);
        
        const minCheckoutDate = getMinCheckoutDate(ref(dateRange.value.from));
        const dateOptions = getDateOptions(unavailableDates);

        const buttonOptions = computed(() => $q.screen.gt.md ? [
            {
                label: destination.value || 'Destination',
                value: 'destination',
                icon: 'place',
            },
            {
                label: dateRange.value.from || 'Check-in',
                value: 'check-in',
                'icon': 'date_range',
            },
            {
                label: dateRange.value.to || 'Check-out',
                value: 'check-out',
                'icon': 'date_range',
            },
        ] : [
            {
                label: destination.value || 'Where are you going?',
                value: 'destination',
                icon: 'search',
            }
        ]);

        const checkInRulesCustom = computed(() => {
            return [
                val => !val || new Date(val) >= new Date(minDate.value) || 'Check-in cannot be in the past',
            ];
        });

        const checkOutRulesCustom = computed(() => {
            return [
                val => !val || new Date(val) > new Date(dateRange.value.from) || 'Check-out must be after check-in'
            ];
        });

        function filterFunction(val, update, abort) {
            if (!val || val.length < 2) { 
                abort();
                filteredDestinations.value = [];
                return;
            } 
            update(() => {
                const needle = val.toLowerCase();
                filteredDestinations.value = availableDestinations.value.filter(v => v.toLowerCase().includes(needle));
            });   
        }

        function handleModelClick(newValue) {
            if (!$q.screen.gt.md) {
                showPopup.value = true;
            }
            searchModel.value = newValue;
        }

        function closePopup() {
            showPopup.value = false;
            searchModel.value = '';  
        }

        function clearFields() {
            destination.value = '';
            dateRange.value.from = '';
            dateRange.value.to = '';
            searchModel.value = '';
            clearSearchCriteria();
        }

        function performSearch() {
            closePopup();
            setSearchCriteria(destination.value, dateRange.value.from, dateRange.value.to);
        }

        return {
            availableDestinations, 
            dateRange, 
            destination, 
            showPopup, 
            searchModel, 
            handleModelClick,
            filterFunction, 
            filteredDestinations, 
            closePopup,
            buttonOptions,
            clearFields,
            performSearch,
            minCheckoutDate,
            checkInRulesCustom,
            checkOutRulesCustom,
            minDate,
            dateOptions,
        }
    }
}
</script>

<style scoped>
    .dialog-card {
        border-bottom-left-radius: 50px !important;
        border-bottom-right-radius: 50px !important;
    }

    .border-bottom {
        border: 1px solid var(--q-primary); 
        border-bottom-width: medium;
    }
</style>