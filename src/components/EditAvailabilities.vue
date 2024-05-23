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
                range
                v-model="tempDateRange"
                class="full-width full-height"
                :option="dateOptions"
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
                    v-for="unavailability in unavailabilities"
                    :key="unavailability.id"
                    clickable
                    v-ripple
                >
                    <q-item-section>
                        <q-item-label>
                            {{ unavailability.date }}
                        </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-item-label caption>
                            <!-- Show the reason for unavailability -->
                            {{ unavailability.available ? 'Available' : 'Unavailable' }}
                        </q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>
    </div>
</template>

<script>

import { ref } from 'vue';
import { getUnavailableDates } from '@/utils/dateUtils';

export default {
  name: 'EditAvailabilities',
  props: {
    room:{
        type: Object,
        required: true
    }
  },
  setup(props) {
    const tempDateRange = ref({ from: null, to: null });
    const eventsFn = (date) => {
      //
    };
    const dateOptions = ref({});
    const lockModel = ref('');
    const unavailabilities = ref([]);
    const roomId = props.room.id;
    const unavailableDates =[];
    
    const eventColorFn = (date) => {
      //
    };
    return {
        splitterModel: ref(20),
        lockModel,
        eventColorFn,
        unavailabilities,
        tempDateRange,
        eventsFn,
        dateOptions,
    };
  }
};

</script>