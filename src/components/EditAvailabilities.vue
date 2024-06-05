<template>
    <div class="col full-height">
        
        <!-- Lock buttons and Instructions -->
        <q-card flat class="q-mb-md">
            <q-card-section>
                <div class="text-h6">Manage Dates</div>
                <q-item-label header class="q-pl-none">
                    Select a date range and use the button below to lock the dates. To unlock a date, click on the trash icon next to the date.
                </q-item-label>
            </q-card-section>
        </q-card>

        <!-- Color legend -->
        <div class="row justify-between">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="height: 10px; width: 10px; background-color: #f44336; border-radius: 50%; margin-right: 8px;"></div>
            Unavailable
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="height: 10px; width: 10px; background-color: #2196f3; border-radius: 50%; margin-right: 8px;"></div>
            Booked
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="height: 10px; width: 10px; background-color: transparent; border-radius: 50%; margin-right: 8px; border: 1px solid #000;"></div>
            Available
            </div>
        </div>
        <q-separator />

        <!-- Calendar -->
        <div class="q-ma-md full-width full-height q-gutter-md">
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
            <q-btn
                push
                rounded
                unelevated
                no-caps
                style="border: 1px solid #f0f0f0;"
                label="Lock dates"
                icon="lock"
                class="full-width"
                @click="lockDates"
            />
        </div>

        <!-- Availabilities list -->
        <q-card flat class="q-ma-md">
            <q-card-section>
                <div class="text-h6 q-mb-md">Room Unavailabilities</div>

                <div class="q-pa-md q-gutter-md row justify-between">
                    <!-- Sort button -->
                    <q-btn rounded unelevated outline label="Sort" icon="sort" class="border-bottom">
                        <q-menu fit :offset="[0, 10]">
                        <q-list>
                            <q-item v-for="option in sortOptions" :key="option.value" clickable v-close-popup @click="applySort(option)">
                            <q-item-section>{{ option.label }}</q-item-section>
                            </q-item>
                        </q-list>
                        </q-menu>
                    </q-btn>
                    <!-- Filters button -->
                    <q-btn rounded unelevated outline label="Filters" icon="tune" class="border-bottom">
                        <q-menu fit :offset="[0, 10]">
                            <q-list>
                                <q-item v-for="filter in filterOptions" :key="filter.value" clickable v-close-popup @click="applyFilter(filter)">
                                    <q-item-section :class="{ 'active-filter': activeFilter === filter.value }">{{ filter.label }}</q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
                <q-list>
                    <q-item
                        v-for="(event, index) in filteredEvents"
                        :key="index"
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
                <q-pagination
                    v-if="allEvents.length > itempsPerPage"
                    v-model="currentPage"
                    color="primary"
                    :max="Math.ceil(allEvents.length / itempsPerPage - 1) || 1"
                    :max-pages="5"
                    :boundary-numbers="false"
                    direction-links
                    class="justify-center"
                />
            </q-card-section>
        </q-card>
    </div>
</template>

<script>

import { onMounted, ref, computed, watch } from 'vue';
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
    setup(props) {
        const currentPage = ref(1);
        const itempsPerPage = ref(10);
        const tempDateRange = ref([
            { from: '', to: ''}
        ]);
        const unavailabilities = ref([]);
        const bookings = ref([]);
        const allEvents = ref([]);
        const $q = useQuasar();
        const sortOptions = [
            { label: 'Date', value: 'date' },
            { label: 'Status', value: 'status' },
        ];
        const filterOptions = [
            { label: 'All', value: 'all' },
            { label: 'Unavailable', value: 'unavailable' },
            { label: 'Booked', value: 'booked' },
        ];
        const activeFilter = ref('all');

        const applySort = (option) => {
            if(option.value === 'date'){
                allEvents.value.sort((a, b) => new Date(a) - new Date(b));
            } else if(option.value === 'status'){
                allEvents.value.sort((a, b) => {
                    if(unavailabilities.value.includes(a) && bookings.value.includes(b)){
                        return -1;
                    } else if(bookings.value.includes(a) && unavailabilities.value.includes(b)){
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        };

        const applyFilter = (filter) => {
            activeFilter.value = filter.value;
            if(filter.value === 'all'){
                allEvents.value = [...unavailabilities.value, ...bookings.value];
            } else if(filter.value === 'unavailable'){
                allEvents.value = unavailabilities.value;
            } else if(filter.value === 'booked'){
                allEvents.value = bookings.value;
            }
        };
        
        onMounted(async () => {
            try {
                unavailabilities.value = await unavailableService.getUnavailableDatesByPropertyArray(props.room.id);
                bookings.value = await bookingService.getBookedDatesByPropertyArray(props.room.id);
                allEvents.value = [...unavailabilities.value, ...bookings.value];
            } catch (error) {
                $q.notify({
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
            }).slice((currentPage.value-1)*itempsPerPage.value,(currentPage.value-1)*itempsPerPage.value+itempsPerPage.value);
        });

        const lockDates = async () => {
            let startDate = new Date(tempDateRange.value.from || tempDateRange.value);
            let endDate = new Date(tempDateRange.value.to || startDate);
            let datesToLock = [];
            let errors = { locked: false, booked: false };

            while (startDate <= endDate) {
                let dateStr = `${startDate.getFullYear()}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getDate().toString().padStart(2, '0')}`;

                if (unavailabilities.value.includes(dateStr)) {
                    errors.locked = true;
                    break;
                } else if (bookings.value.includes(dateStr)) {
                    errors.booked = true;
                    break;
                }
                datesToLock.push(dateStr);
                startDate.setDate(startDate.getDate() + 1);
            }

            if (errors.locked || errors.booked) {
                $q.notify({
                    color: 'negative',
                    message: `One or more dates are already ${errors.locked ? 'locked' : 'booked'}`,
                    position: 'top',
                    icon: 'report_problem'
                });
            } else if (datesToLock.length > 0) {
                let formattedStartDate = datesToLock[0].replace(/\//g, '-');
                let formattedEndDate = datesToLock[datesToLock.length - 1].replace(/\//g, '-');

                await unavailableService.createUnavailable({
                    property: props.room.url,
                    start_date: formattedStartDate,
                    end_date: formattedEndDate,
                    comment: 'Locked via UI'
                });
                unavailabilities.value = [...unavailabilities.value, ...datesToLock];
                allEvents.value = [...unavailabilities.value, ...bookings.value];
                activeFilter.value = 'all';
                $q.notify({
                    color: 'positive',
                    message: 'Dates locked successfully',
                    position: 'top',
                    icon: 'lock'
                });
            }
        };

        return {
            tempDateRange,
            eventColor,
            unavailabilities,
            bookings,
            allEvents,
            filteredEvents,
            lockDates,
            sortOptions,
            filterOptions,
            activeFilter,
            applySort,
            applyFilter,
            currentPage,
            itempsPerPage
        };
    },
    methods:{
        handleDateChange(newDate){
            const date = newDate.replace(/\//g, '-');

            const index = this.tempDateRange.findIndex(range => range.from === date || range.to === date);

            if(index !== -1){
                this.tempDateRange.splice(index, 1);
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
};

</script>

<style scoped>
    .border-bottom {
        border: 0 solid var(--q-primary); 
        border-bottom-width: revert;
    }
    .active-filter {
        color: var(--q-secondary);
    }
</style>