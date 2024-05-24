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
                        :img-src="image.image_url ? image.image_url : image.ext_url"
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
                <div class="text-overline text-secondary q-pt-md">{{ room.city.name }}</div>
                <q-rating readonly color="black" v-model="room.average_rating" :max="5" size="16px" />
                <div class="text-h5 q-mt-sm q-mb-xs">{{ room.title }}</div>
                <div class="text-subtitle1 q-mb-xs">{{ formatNumber(room.surface) }} m²</div>
                <div class="text-h7 text-dark q-mb-xs">CHF {{ formatNumber(room.price_per_night) }}.- per night</div>
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
                        />
                        <q-input
                            dense
                            label="Check-out"
                            :disable="!checkIn"
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
                        :disabled="isBookButtonDisabled"
                        @click="handleBookRoom(room.id, checkIn, checkOut)"
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
                        <div class="text-h7 text-dark q-mb-xs" style="text-align: right;">CHF {{ formatNumber(room.price_per_night) }}.-</div>
                        <div class="text-h7 text-dark q-mb-xs" style="text-align: right;">{{ formatNumber(totalNights) }}</div>
                    </div>
                </div>
                <q-separator class="q-my-md" />
                <div class="row justify-between">
                    <div>
                        <div class="text-h7 text-dark q-mb-xs"><b>Total price</b></div>
                    </div>
                    <div>
                        <div class="text-h7 text-dark q-mb-xs"><b>CHF {{ formatNumber(room.price_per_night * totalNights) }}.-</b></div>
                    </div>
                </div>
            </q-card-section>
            <!-- TODO: Add the reviews section -->
        </q-card>
    </div>
  </template>
  
<script>
    import { ref, computed, watch, defineComponent, onMounted, inject } from 'vue';
    import { useRouter } from 'vue-router';
    import authService from '@/services/authService';  
    import { setLastIntent } from '@/utils/globalState';
    import { getMinCheckoutDate, getCheckInRules, getCheckOutRules } from '@/utils/dateUtils';

    export default defineComponent({
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
            const router = useRouter();
            const toggleLogin = inject('toggleLogin');

            function handleBookRoom(roomId, checkIn, checkOut) {
                if(authService.user.value) {
                    router.push({
                        name: 'Booking',
                        query: { roomId, checkIn, checkOut }
                    });
                } else {
                    setLastIntent({
                        name: 'Booking',
                        query: { roomId, checkIn, checkOut }
                    });
                    toggleLogin();
                }
            }

            const minCheckoutDate = getMinCheckoutDate(checkIn);
            const checkInRules = getCheckInRules(minDate);
            const checkOutRules = getCheckOutRules(checkIn);

            const isBookButtonDisabled = computed(() => {
            return !checkIn.value || !checkOut.value ||
                   !checkInRules.value.every(rule => rule(checkIn.value) === true) ||
                   !checkOutRules.value.every(rule => rule(checkOut.value) === true);
            });

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
                checkOutRules,
                handleBookRoom,
                isBookButtonDisabled
            }
        },
        methods: {
            // Helper function to format amenities
            formatAmenities(amenities) {
                if (!amenities) return '';
                return amenities.join(' · ');
            },
            // Helper function to format number with ''' separator
            formatNumber(number) {
                if(number) {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                }
                return 0;
            }
        }
    });
</script>
  