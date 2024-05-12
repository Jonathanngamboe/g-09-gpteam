<template>
    <!-- Search bar elements for big screens -->
    <div class="row items-center q-pa-md" v-show="$q.screen.gt.md" style="min-width: 25%; width: 50%;">
        <!-- Destination input -->
        <q-select
            dense
            hide-dropdown-icon
            v-model="destination"
            label="Destination"
            class="col"
            :options="availableDestinations"
            use-input
            fill-input
            input-debounce="0"
            @filter="filterFunction"
        />
        <!-- Check-in -->
        <q-input
            type="date"
            dense
            v-model="dateRange.start"
            label="Check-in"
            class="col"
            @click="focusInput"
            ref="startDateInput"
        />
        <!-- Check-out -->
        <q-input
            type="date"
            dense
            v-model="dateRange.end"
            label="Check-out"
            class="col"
            @click="focusInput"
            ref="endDateInput"
        /> 
        <!-- Search button -->
        <q-btn rounded unelevated color="primary" icon="search" class="q-ml-md" />
    </div>
    <!-- Search bar for small screens -->
    <!-- Search input -->
    <div class="row items-center q-pa-md" v-show="$q.screen.lt.lg" style="min-width: 25%; width: 50%;">
        <q-input rounded outlined readonly dense v-model="destination" class="col mobile-input" @click="showPopup = true" label="Where are you going?">
            <template v-slot:append>
                <q-icon name="search" @click="showPopup = true" />
            </template>
        </q-input>
    </div>
    <!-- Popup dialog for small screens -->
    <q-dialog v-model="showPopup" position="top">
        <q-card  class="full-width">
            <!-- Close button -->
            <div class="row justify-end q-mt-md q-mr-md">
                <q-btn rounded flat @click="showPopup = false" color="negative" icon="close" />
            </div>
            <!-- Title -->
            <q-card-section class="text-h6 q-mx-lg"><strong>Search for a destination</strong></q-card-section>
            <!-- Input fields -->
            <q-card-section class="col q-ma-md">
                <!-- Destination input -->
                <q-select
                    rounded 
                    outlined
                    dense
                    hide-dropdown-icon
                    v-model="destination"
                    label="Destination"
                    class="col q-mb-md"
                    :options="availableDestinations"
                    use-input
                    fill-input
                    input-debounce="0"
                    @filter="filterFunction"
                    placeholder="Where are you going?"
                />                
                <!-- Check-in -->
                <q-input
                    rounded
                    outlined
                    type="date"
                    dense
                    v-model="dateRange.start"
                    label="Check-in"
                    class="col q-mb-md"
                    @click="focusInput"
                    ref="startDateInput"
                />
                <!-- Check-out -->
                <q-input
                    rounded
                    outlined
                    type="date"
                    dense
                    v-model="dateRange.end"
                    label="Check-out"
                    class="col q-mb-md"
                    @click="focusInput"
                    ref="endDateInput"
                /> 
            </q-card-section>
            <q-card-actions class="row justify-between q-mx-lg q-my-md">
                <!-- Clear button -->
                <q-btn rounded unelevated label="Clear" />
                <!-- Search button -->
                <q-btn rounded unelevated color="primary" icon="search"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
  
<script>
import { ref } from 'vue';

    export default {
        setup() {
            const showPopup = ref(false);
            const destination = ref('');
            const dateRange = ref({
                start: '',
                end: ''
            });

            const availableDestinations = ref([
                'Paris', 'London', 'New York', 'Tokyo', 'Sydney', 'Cape Town'
            ]);

            function destionation() {
                return destination.value || 'Where are you going?';
            }

            function filterFunction(val, update) {
                update(() => {
                    if (val === '') {
                        availableDestinations.value = ['Paris', 'London', 'New York', 'Tokyo', 'Sydney', 'Cape Town'];
                    } else {
                        const needle = val.toLowerCase();
                        availableDestinations.value = ['Paris', 'London', 'New York', 'Tokyo', 'Sydney', 'Cape Town'].filter(v => v.toLowerCase().indexOf(needle) > -1);
                    }
                });
            }

            return {
                availableDestinations,
                dateRange,
                destination,
                showPopup,
                filterFunction
            }
        }
    }
</script>

<style scoped>
    .q-field--date .q-field__append {
        display: none;
    }
</style>