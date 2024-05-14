<template>
    <q-page class="q-pa-md">
        <div class="q-pa-md" style="max-width: 700px; margin: auto;">
            <q-card flat>
                <!-- Title and booking summary -->
                <q-card-section class="row items-center">
                    <!-- Back button -->
                    <q-btn flat round dense icon="arrow_back_ios_new" @click="router.back()" />
                    <div class="text-h5 text-bold">Confirm booking</div>
                </q-card-section>
                <q-separator />
                <!-- Room details -->
                <q-card-section>
                    <div class="text-h6">Your booking</div>
                    <q-card-section class="row justify-between items-center q-px-none">
                        <!-- Title -->
                        <div class="col">
                            <div class="text-h6 q-mt-sm q-mb-xs">{{ room.title || 'No title available' }}</div>
                            <q-rating readonly color="black" v-model="room.average_rating" :max="5" size="16px" v-if="room.average_rating" />
                        </div>
                        <!-- Image -->
                        <div class="col-auto">
                            <q-img :src="room.images && room.images.length > 0 ? room.images[0].image : 'https://www.trojanpress.com.au/wp-content/uploads/2019/05/Image-Coming-Soon-02-1024x683.jpg'"
                                style="width: 100px;" alt="Room image"/>   
                        </div>
                    </q-card-section>
                    <!-- Booking details -->
                    <div class="full-width">
                        <div class="row justify-between items-center">
                            <div><strong>Dates : </strong> {{ formattedDateRange }}</div>
                            <q-btn flat rounded padding="none" class="q-ml-sm" icon="edit" size="10px" @click="editDates()" />
                        </div>
                        <div class="row justify-between"><strong>Price per night</strong>CHF {{ formatNumber(room.price_per_night) }}.-</div>
                        <div class="row justify-between"><strong>Number of nights</strong> {{ formatNumber(totalNights) }}</div>
                        <q-separator class="q-my-md" />
                        <div class="row justify-between"><strong>Total price</strong>CHF {{ formatNumber(room.price_per_night * totalNights) }}.-</div>
                    </div>
                </q-card-section>
                <q-separator />
                <!-- Payment details -->
                <q-card-section>
                    <div class="text-h6">Payment method</div>
                    <q-select borderless v-model="paymentMethod" color="secondary" :options="paymentOptions"/>
                </q-card-section>
                <q-separator />
                <!-- Message to host -->
                <q-card-section>
                    <div class="text-h6">Send a message to the host</div>
                    <q-input v-model="message" type="textarea" hint="Indicate your arrival time or any special request" placeholder="Hello, I am your guest for the weekend. I will arrive at 6pm." />
                </q-card-section>
                <!-- Confirm and pay button -->
                <q-card-section>
                    <q-btn unelevated rounded label="Confirm and pay" color="green" class="full-width" @click="submitBooking()" :disable="isConfirmButtonDisabled" />
                </q-card-section>
            </q-card>
        </div>
        <!-- Dialog for editing dates -->
        <q-dialog v-model="showDialog" :position="dialogPosition">
            <q-card>
                <q-card-section class="row items-center justify-center q-pa-none">
                    <q-date flat v-model="tempDateRange" range :options="dateOptions" class="full-width"/>
                </q-card-section>
                <q-card-section class="row justify-between">
                    <q-btn flat rounded label="Cancel" color="negative" @click="showDialog = false" />
                    <q-btn unelevated rounded label="Save" color="primary" @click="saveNewDates" />
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
  </template>
  
<script>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import roomService from '@/services/roomService';
  import authService from '@/services/authService';
  import mailService from '@/services/mailService';
  import { getDateOptions } from '@/utils/dateUtils';

  export default {
    setup() {
        const $q = useQuasar();
        const route = useRoute();
        const router = useRouter();
        const dialogPosition = computed(() => $q.screen.lt.md ? 'bottom' : 'standard');

        const paymentMethod = ref('');
        const paymentOptions = ref([{ label: 'Invoice', value: 'Invoice' }]);
        const message = ref('');
        const totalNights = ref(0);

        const showDialog = ref(false);

        const dateRange = ref({ from: null, to: null });
        const tempDateRange = ref({ from: null, to: null });
        const isConfirmButtonDisabled = ref(true);
        
        const unavailableDates = ref([]); // TODO: Fetch unavailable dates from the database. Example: { start: "2024-05-20", end: "2024-05-22"}
        const dateOptions = getDateOptions(unavailableDates);

        const room = ref({});

        const formattedDateRange = computed(() => {
            if (!dateRange.value) return "-";
            const from = dateRange.value.from;
            const to = dateRange.value.to;
            if (!from || !to) return "-";
            const startDate = parseDate(from);
            const endDate = parseDate(to);
            if (!startDate || !endDate) return "-";
            if (startDate.getFullYear() === endDate.getFullYear()) {
                return `${startDate.toDateString().substring(4, 10)} - ${endDate.toDateString().substring(4, 10)}, ${endDate.getFullYear()}`;
            } else {
                return `${startDate.toDateString().substring(4, 10)}, ${startDate.getFullYear()} - ${endDate.toDateString().substring(4, 10)}, ${endDate.getFullYear()}`;
            }
        });  

        onMounted(async () => {
            if (!authService.user.value) {
                notify('Please log in to book a room.', 'red');
                router.push('/');
            } else {
                if (route.query.roomId) {
                    room.value = await roomService.getRoomById(route.query.roomId);
                    updateDateRange(route.query.checkIn, route.query.checkOut);
                } else {
                    notify('Please select a room first.', 'red');
                    router.push('/');
                }
                paymentMethod.value = paymentOptions.value[0].value;
            }
        });

        const editDates = () => {
            tempDateRange.value = { ...dateRange.value };
            showDialog.value = true;
        };

        const saveNewDates = () => {
            if(!tempDateRange.value) {
                return;
            }
            if (validateDates(tempDateRange.value.from, tempDateRange.value.to)) {
                dateRange.value = { ...tempDateRange.value };
                showDialog.value = false;
            }
        };

        function updateDateRange(from, to) {
            if(validateDates(from, to)) {
                from = from || new Date().toISOString().split('T')[0];
                to = to || new Date().toISOString().split('T')[0];
                dateRange.value = { from, to };
            }
        }

        function validateDates(from, to) {
            const startDate = parseDate(from);
            const endDate = parseDate(to);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (!startDate || !endDate) {
                notify('Both start and end dates must be valid.', 'red');
                return false;
            }
            if (endDate <= startDate) {
                notify('The end date must be after the start date.', 'red');
                return false;
            }
            if (startDate < today) {
                notify('The start date cannot be in the past.', 'red');
                return false;
            }

            isConfirmButtonDisabled.value = false;
            totalNights.value = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            return true;
        }

        function parseDate(dateStr) {
            if (!dateStr) return null; 
            const parts = dateStr.split(/[-\/]/); // Split on both dash and slash
            if (parts.length !== 3) return null; 

            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; 
            const day = parseInt(parts[2], 10);

            const date = new Date(year, month, day);
            if (isNaN(date.getTime())) return null;

            return date;
        }

        function notify(message, color) {
            $q.notify({ color, textColor: 'white', icon: 'error', position: 'top', message });
        }

        async function submitBooking() {
            let bookingDetails = {
                email: authService.user.value.email,
                roomTitle: room.value.title,
                checkIn: dateRange.value.from,
                checkOut: dateRange.value.to,
                totalPrice: room.value.price_per_night * totalNights.value,
            };
            notify('Thank you for your booking.', 'green');
            await new Promise(resolve => setTimeout(resolve, 2000));
            const response = await mailService.sendEmail(bookingDetails);
            if (response.status === 'success') {
                notify('Confirmation email sent.', 'green');
            } else {
                notify('Failed to send confirmation email : ' + response.data, 'red');
            }
            router.push('My-account');
        }

        return {
            room,
            paymentMethod,
            paymentOptions,
            message,
            totalNights,
            router,
            showDialog,
            dateRange,
            isConfirmButtonDisabled,
            submitBooking,
            editDates,
            saveNewDates,
            dateOptions,
            formattedDateRange,
            tempDateRange,
            dialogPosition
        };
    },
    methods: {
        // Helper function to format number with ''' separator
        formatNumber(number) {
            if(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            }
            return 0;
        }
    }
  }
  </script>
  