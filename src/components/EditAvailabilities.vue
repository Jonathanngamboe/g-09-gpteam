<template>
    <div class="col full-height">
        <!-- Lock buttons -->
        <div class="q-mb-xl">
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
                    {label: 'Lock date', value: 'one'},
                    {label: 'Unlock date', value: 'two'}
                ]"
            />
        </div>

        <!-- Calendar -->
        <div class="q-ma-md full-width full-height">
            <q-date
                flat
                landscape
                range multiple
                v-model="tempDateRange"
                class="full-width full-height"
                :options="dateOptions"
                :events="eventsFn"
                :event-color="eventColorFn"
            />
        </div>

        <q-separator />

        <!-- Availabilities list -->
        <div class="q-ma-md">
            <q-item-label header>
                Unvailabilities
            </q-item-label>
            <q-list>
                <q-item
                    v-for="(dateRange, index) in tempDateRange" 
                    :key="index"
                    clickable
                    v-ripple
                >
                    <q-item-section>
                        <q-item-label>
                            From: {{ dateRange.from }} - To: {{ dateRange.to }}
                        </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-item-label caption>
                            <!-- Show the reason for unavailability -->
                            Unavailable
                        </q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>
    </div>
</template>

<script>

import { onMounted, ref } from 'vue';
import { getUnavailableDates, updateUnavailableDates} from '@/utils/dateUtils';
import { date } from 'quasar';

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
        };
    },
  watch:{
    lockModel(newVal){
        if(newVal === 'one'){
            this.saveDates();
        }
    },
  },
  setup(props) {
    const tempDateRange = ref([]);
    const unavailability = ref([]);
    const lockModel = ref('');
    const roomId = props.room.id;
    console.log('TempDateRange:', tempDateRange.value);

    onMounted(async () => {
        try {
            const result = await getUnavailableDates(roomId);
            unavailability.value = result;
            
            for(let i = 0; i < unavailability.value.length; i++) {
                tempDateRange.value.push({from: unavailability.value[i].start, to: unavailability.value[i].end});
            }
        } catch (error) {
            console.error('Error fetching unavailable dates:', error);
        }
    });
    
    // const dateOptions = (date) => {
    // //     const dateString = date.replace(/\//g, '-');
    // //     return unavailability.value.includes(dateString) ? { disable:True } : {};
    // };

    // const eventColorFn = (date) => {
    //     // const dateString = date.replace(/\//g, '-');
    //     // return unavailability.value.includes(dateString) ? 'dark' : 'light';
    // };
    // const eventsFn = (date) => {
    //     // const dateString = date.replace(/\//g, '-');
    //     // return unavailability.value.includes(dateString) ? ['unavailable'] : [];
    // };

    return {
        splitterModel: ref(20),
        lockModel,        
        tempDateRange,
        // eventColorFn,
        // eventsFn,
        // dateOptions,
        unavailability,
    };
  },
  methods:{
    async saveDates(){
        const lastDateRange = this.tempDateRange[this.tempDateRange.length - 1];
        const start_date = lastDateRange.from.replace(/\//g, '-');
        const end_date = lastDateRange.to.replace(/\//g, '-');
        console.log('Start Date:', start_date);
        try{
            await updateUnavailableDates(this.room.id, start_date, end_date);
            this.$q.notify({
                color: 'green',
                textColor: 'white',
                position: 'top',
                message: 'Dates saved successfully',
                icon: 'check'
            });
        }catch (error){
            console.log('Error saving dates:', error);
            this.$q.notify({
                color: 'red',
                textColor: 'white',
                position: 'top',
                message: 'Error saving dates',
                icon: 'warning'
            });
        }
    }
  },
};

</script>