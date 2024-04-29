<template>
    <div style="min-width: 100%;">
        <q-card>
            <q-card-section>
                <!-- Image carousel -->
                <q-carousel
                    swipeable
                    animated
                    arrows
                    v-model="slide"
                    v-model:fullscreen="fullscreen"
                    infinite
                    thumbnails
                    >
                    <q-carousel-slide
                        v-for="(image, index) in room.images"
                        :key="index"
                        :name="index"
                        :img-src="image"
                    />                
                    <template v-slot:control>
                        <q-carousel-control
                        position="bottom-right"
                        :offset="[18, 18]"
                        >
                        <q-btn
                            push round dense color="white" text-color="primary"
                            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                            @click="fullscreen = !fullscreen"
                        />
                        </q-carousel-control>
                    </template>
                </q-carousel>
                <!-- Room details -->
                <div class="text-overline text-secondary q-pt-md">{{ room.location }}</div>
                <q-rating readonly color="black" v-model="room.rating" :max="5" size="16px" />
                <div class="text-h5 q-mt-sm q-mb-xs">{{ room.title }}</div>
                <div class="text-subtitle1 q-mb-xs">{{ formatNumber(room.surfaceArea) }} m²</div>
                <div class="text-h7 text-dark q-mb-xs">CHF {{ formatNumber(room.price) }}.- per night</div>
                <div class="text-caption text-grey">{{ formatAmenities(room.amenities) }}</div>
                <div class="text-subtitle2 q-mt-md">{{ room.description }}</div>
            </q-card-section>
            <!-- Card actions -->
            <q-card-section> 
                <div>
                    <!-- Input fields for the date range -->
                    <div class="row justify-between">
                        <q-input
                            dense
                            label="Check-in"
                            v-model="checkIn"
                            type="date"
                            style="width: 48%"
                            :min="minDate"
                            :rules="checkInRules"
                            :disable="isRoomBooked"
                        />
                        <q-input
                            dense
                            label="Check-out"
                            :disable="!checkIn || isRoomBooked"
                            v-model="checkOut"
                            type="date"
                            style="width: 48%"
                            :min="minCheckoutDate"
                            :rules="checkOutRules"
                        />  
                    </div>           
                    <!-- Book button -->
                    <q-btn
                        class="full-width"
                        unelevated
                        rounded
                        color="green-14"
                        label="Book"
                        @click="$emit('book-room', room.id)"
                    />
                </div>  
            </q-card-section>
            <!-- Price dtails -->
            <q-card-section>
                <div class="row justify-between">
                    <div>
                        <div class="text-h7 text-dark q-mb-xs">Price per night</div>
                        <div class="text-h7 text-dark q-mb-xs">Number of nights</div>
                    </div>
                    <div>
                        <div class="text-h7 text-dark q-mb-xs" style="text-align: right;">CHF {{ formatNumber(room.price) }}.-</div>
                        <div class="text-h7 text-dark q-mb-xs" style="text-align: right;">{{ formatNumber(totalNights) }}</div>
                    </div>
                </div>
                <q-separator class="q-my-md" />
                <div class="row justify-between">
                    <div>
                        <div class="text-h7 text-dark q-mb-xs"><b>Total price</b></div>
                    </div>
                    <div>
                        <div class="text-h7 text-dark q-mb-xs"><b>CHF {{ formatNumber(room.price * totalNights) }}.-</b></div>
                    </div>
                </div>
            </q-card-section>
            <!-- TODO: Add the reviews section -->
        </q-card>
    </div>
  </template>
  
  <script>
  import { format } from 'prettier';
import { ref, computed, watch, defineComponent } from 'vue';
  
  export default defineComponent({
    data(){
        return{
            checkIn: '',
            checkOut: '',
            bookings: []
        }
    },
    computed:{
        isRoomBooked(){
            return this.bookings.some(booking =>
                (new Date(booking.checkIn) <= new Date(this.checkIn) && new Date(booking.checkOut) >= new Date(this.checkIn)) ||
                (new Date(booking.checkIn) <= new Date(this.checkOut) && new Date(booking.checkOut) >= new Date(this.checkOut))
            );
        }
    },
    emits: ['book-room'],
    props: {
      room: {
        type: Object,
        required: true
      }
    },
    setup () {
        const totalNights = ref(0);
        const today = new Date();
        const minDate = ref(today.toISOString().split('T')[0]);
        const checkIn = ref('');
        const checkOut = ref('');

        const minCheckoutDate = computed(() => {
            const todayPlusOne = new Date();
            todayPlusOne.setDate(today.getDate() + 1); // Set to tomorrow

            let latestDate = todayPlusOne; // Default to tomorrow

            if (checkIn.value) {
                const dayAfterCheckIn = new Date(new Date(checkIn.value).getTime() + (24 * 3600 * 1000));
                // Compare using getTime() and create a new Date from the maximum timestamp
                latestDate = new Date(Math.max(dayAfterCheckIn.getTime(), todayPlusOne.getTime()));
            }

            return latestDate.toISOString().split('T')[0]; // Convert back to ISO string for the input min attribute
            });

        const checkInRules = computed(() => [
            val => !!val || 'Check-in date is required',
            val => new Date(val) >= new Date(minDate.value) || 'Check-in cannot be in the past'
        ]);

        const checkOutRules = computed(() => [
            val => !!val || 'Check-out date is required',
            val => new Date(val) > new Date(checkIn.value) || 'Check-out must be after check-in'
        ]);


        // Watchers to calculate totalNights based on valid date entries
        watch([checkIn, checkOut], ([checkInDate, checkOutDate]) => {
            if (new Date(checkOutDate) > new Date(checkInDate)) {
                totalNights.value = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
                totalNights.value = Math.max(0, Math.round(totalNights.value)); // Ensure no negative nights
            } else {
                totalNights.value = 0; // Reset to 0 if dates are invalid
            }
            });

        return {
            slide: ref(0),
            fullscreen: ref(false),
            totalNights,
            checkIn,
            checkOut,
            minDate,
            minCheckoutDate,
            checkInRules,
            checkOutRules
        }
    },
    methods: {
      // Helper function to format amenities
      formatAmenities(amenities) {
        return amenities.join(' · ');
      },
      // Helper function to format number with ''' separator
      formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      },
      async fetchBookings() {
        const response = await fetch('https://localhost:8000/api/bookings');
        this.bookings = await response.json();
      }
    },
    created(){
        this.fetchBookings();
    }
  });
  </script>
  