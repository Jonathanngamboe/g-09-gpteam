<template>
    <div class="col full-height">
        
        <!-- Lock buttons and Instructions -->
        <q-card flat class="q-mb-md">
            <q-card-section>
                <div class="text-h6">Manage Dates</div>
                <q-item-label header>
                    Select a date range and use the buttons below to lock or unlock it.
                </q-item-label>
                <q-btn-toggle
                    v-model="lockModel"
                    spread
                    no-caps
                    rounded
                    unelevated
                    style="border: 1px solid #f0f0f0;"
                    toggle-color="primary"
                    color="white"
                    text-color="primary"
                    :options="[
                        {label: 'Lock date', value: 'one', icon: 'lock'},
                        {label: 'Unlock date', value: 'two', icon: 'lock_open'}
                    ]"
                />
            </q-card-section>
        </q-card>

        <q-separator />

        <!-- Color legend -->
        <div class="q-ma-md">
            <div class="text-h6 q-mb-md">Color Legend</div>
            <div class="row justify-between">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="height: 10px; width: 10px; background-color: red; border-radius: 50%; margin-right: 8px;"></div>
                Unavailable
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="height: 10px; width: 10px; background-color: blue; border-radius: 50%; margin-right: 8px;"></div>
                Booked
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="height: 10px; width: 10px; background-color: transparent; border-radius: 50%; margin-right: 8px; border: 1px solid #000;"></div>
                Available
                </div>
            </div>
        </div>
        <q-separator />

        <!-- Calendar -->
        <div class="q-ma-md full-width full-height">
            <q-date
                flat
                landscape
                range
                v-model="tempDateRange"
                class="full-width full-height"
                :options="date => new Date(date) >= new Date()"
                :events="allEvents"
                :event-color="date => eventColor(date)"
                @input="handleDateChange"
            />
        </div>
        <q-separator />

        <!-- Availabilities list -->
        <q-card flat class="q-ma-md">
            <q-card-section>
                <div class="text-h6">Room Unavailabilities</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
                <q-list>
                <q-item
                    v-for="event in filteredEvents"
                    :key="event.date"
                    clickable
                    v-ripple
                    class="q-mb-md"
                >
                    <q-item-section avatar>
                        <q-avatar :color="unavailabilities.some(d => d === event) ? 'red' : 'blue'" style="width: 10px; height: 10px;"/>
                    </q-item-section>
                    <q-item-section>
                    <q-item-label>{{ event }}</q-item-label>
                    <q-item-label caption>
                        <!-- Display status based on event.  is determined by checking if the event date is in the unavailabilities or bookings array -->
                        {{ unavailabilities.some(d => d === event) ? 'Unavailable' : 'Booked' }}
                    </q-item-label>
                    </q-item-section>
                    <q-item-section side top v-if="unavailabilities.some(d => d === event)">
                    <q-btn flat round icon="delete" @click="deleteDate(event)" />
                    </q-item-section>
                </q-item>
                </q-list>
            </q-card-section>
        </q-card>
    </div>
</template>

<script>

import { onMounted, ref, computed } from 'vue';
import unavailableService from '@/services/unavailableService';
import bookingService from '@/services/bookingService';
import { useQuasar } from 'quasar';

export default {
    name: 'EditAvailabilities',
    props: {
        room:{
            type: Object,
            required: true
        }
    },
    data() {
        return {
            lockModel: 'two',
            $q: useQuasar(),
        };
    },
    setup(props) {
        const tempDateRange = ref([
            { from: '', to: ''}
        ]);
        //const tempDateRange = ref([]);
        const unavailabilities = ref([]);
        const bookings = ref([]);
        const lockModel = ref('');
        const allEvents = ref([]);
        
        onMounted(async () => {
            try {
                unavailabilities.value = await unavailableService.getUnavailableDatesByPropertyArray(props.room.id);
                bookings.value = await bookingService.getBookedDatesByPropertyArray(props.room.id);
                allEvents.value = [...unavailabilities.value, ...bookings.value];
            } catch (error) {
                this.$q.notify({
                    color: 'negative',
                    position: 'top',
                    message: `${error.message}`,
                    icon: 'report_problem',
                });
            }
        });

        const eventColor = (date) => {
            if (unavailabilities.value.some(d => d === date)) {
                return 'red'; 
            } else if (bookings.value.some(d => d === date)) {
                return 'blue';
            }
            return 'green';
        };

        const filteredEvents = computed(() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today's date for comparison

            return allEvents.value.filter(event => {
                const eventDate = new Date(event.replace(/-/g, '/'));
                eventDate.setHours(0, 0, 0, 0); // Normalize event date
                return eventDate >= today;
            });
        });

        return {
            splitterModel: ref(20),
            lockModel,        
            tempDateRange,
            eventColor,
            unavailabilities,
            bookings,
            allEvents,
            filteredEvents,
        };
    },
    methods:{
        handleDateChange(newDate){
            const date = newDate.replace(/\//g, '-');

            const index = this.tempDateRange.findIndex(range => range.from === date || range.to === date);

            if(index !== -1){
            this.tempDateRange.splice(index, 1);
            //this.deleteDate(date, date);
            }
        },
        async deleteDate(date) {
        try {
            await unavailableService.deleteUnavailableByDate(this.room.id, this.room.url, date);
            this.$q.notify({
                color: 'positive',
                position: 'top',
                message: 'Date successfully unlocked.',
                icon: 'check_circle',
            });
            // Refresh the list of unavailabilities
            this.unavailabilities = await unavailableService.getUnavailableDatesByPropertyArray(this.room.id);
            this.bookings = await bookingService.getBookedDatesByPropertyArray(this.room.id);
            this.allEvents = [...this.unavailabilities, ...this.bookings];
        } catch (error) {
            this.$q.notify({
                color: 'negative',
                position: 'top',
                message: `${error.message}`,
                icon: 'report_problem',
            });
        }
    }
    },
    watch: {
        lockModel(newVal, oldVal) {
            // Ensure logic here is clear and works as intended
            if (newVal === 'one' && oldVal === 'two') { // Locking a range
                // Add lock status or similar action
            } else if (newVal === 'two' && oldVal === 'one') { // Unlocking a range
                // Remove lock status or similar action
            }
        }
    },
};

</script>