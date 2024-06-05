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
                            <q-img :src="room.images && room.images.length > 0 ? (room.images[0].image || room.images[0].ext_url) : 'https://www.trojanpress.com.au/wp-content/uploads/2019/05/Image-Coming-Soon-02-1024x683.jpg'"
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
                    <q-btn unelevated rounded label="Confirm and pay" color="green-14" class="full-width" @click="submitBooking()" :disable="isConfirmButtonDisabled" />
                </q-card-section>
            </q-card>
        </div>
        <!-- Dialog for editing dates -->
        <q-dialog v-model="showDialog" :position="dialogPosition">
            <q-card>
                <q-card-section class="row items-center justify-center q-pa-none">
                    <q-date landscape flat v-model="tempDateRange" range :options="dateOptions || disableDates" class="full-width"/>
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
  import propertyService from '@/services/propertyService';
  import authService from '@/services/authService';
  import mailService from '@/services/mailService';
  import { getDateOptions, getBookedDatesArray, getUnavailableDatesArray } from '@/utils/dateUtils';
  import bookingService from '@/services/bookingService';
  import statusService from '@/services/statusService';

  export default {
    setup(props) {
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
        
        const unavailableDates = ref([]);
        const bookedDates = ref([]);
        const tempBookRange = ref([]);
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
                notify('An error occurred. Please make sure you are logged in and refresh the page.', 'red');
                router.push('/');
            } else {
                if (route.query.roomId) {
                    room.value = await propertyService.getPropertyById(route.query.roomId);
                    updateDateRange(route.query.checkIn, route.query.checkOut);
                } else {
                    notify('Please select a room first.', 'red');
                    router.push('/');
                }
                paymentMethod.value = paymentOptions.value[0].value;
            }
            try {
                    const bookingResult = await getBookedDatesArray(route.query.roomId);
                    const unavailableResult = await getUnavailableDatesArray(route.query.roomId);
                    bookedDates.value = bookingResult;
                    unavailableDates.value = unavailableResult;
            
                    for(let i = 0; i < bookedDates.value.length; i++) {
                        tempBookRange.value.push(bookedDates.value[i]);
                    }
                    for(let i = 0; i < unavailableDates.value.length; i++) {
                        tempBookRange.value.push(unavailableDates.value[i]);
                    }
                } catch (error) {
                    console.error('Error fetching unavailable dates:', error);
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

        async function getOwner() {
            try {
                const owner = await authService.getUserByUrl(room.value.owner);
                return owner;
            } catch (error) {
                notify('Failed to get owner information.', 'red');
                return null;
            }
        }

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

        // Helper function to format number with ''' separator
        function formatNumber(number) {
            if(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            }
            return 0;
        }

        async function submitBooking() {
            try {
                const user = await authService.getCustomuser()
                if(!user) {
                    notify('Failed to get user information.', 'red');
                    return;
                }
                
                const status = await statusService.getAllStatus();
                const pendingStatus = status.find(s => s.name === 'Pending');
                if (!pendingStatus) {
                    notify('Failed to find the status "Pending".', 'red');
                    return;
                }
                
                // Add booking to the database
                const booking = {
                    check_in: dateRange.value.from,
                    check_out: dateRange.value.to,
                    property: room.value.url,
                    user: user.url,
                    status: pendingStatus.url,
                    //total_price: room.value.price_per_night * totalNights.value,
                };
                const bookingResponse = await bookingService.createBooking(booking);

                // Send booking confirmation email
                if (bookingResponse !== null) {
                    // TODO: Redirect to user's history page
                    router.push('My-account');
                    // Send confirmation email to the student
                    const confirmationEmail = {
                    email: authService.user.value.email,
                    subject: 'Booking confirmation',
                    message: `Hi !\n\n` +
                        `Thank you for your booking for ${room.value.title}!\n\n` +
                        `Dates: ${formattedDateRange.value}\n` +
                        `Price per night: CHF ${formatNumber(room.value.price_per_night)}\n` +
                        `Number of nights: ${formatNumber(totalNights.value)}\n` +
                        `Total price: CHF ${formatNumber(room.value.price_per_night * totalNights.value)}\n\n` +
                        (message.value ? `Message to host: ${message.value}\n\n` : '') +
                        `Payment method: ${paymentMethod.value}\n\n` +
                        (paymentMethod.value === 'Invoice' ? 'Please pay the total amount to the following bank account:\nIBAN: CHXX XXXX XXXX XXXX XXXX\nAccount holder: GPTeam\n\n' : '') +
                        `Enjoy your stay!\n\nGPTeam`
                    };
                    const emailResponse = await mailService.sendEmail(confirmationEmail);
                    if (emailResponse.status === 'success') {
                        notify('Booking and confirmation email sent successfully.', 'green');
                    } else {
                        notify('Failed to send confirmation email: ' + emailResponse.message, 'red');
                    }
                    // Send booking notification email to the host 
                    const owner = await getOwner();
                    const notificationEmail = {
                        email: owner.email,
                        subject: 'New booking',
                        message: `Hi ${owner.first_name}!\n\n` +
                            `You have a new booking for ${room.value.title}!\n\n` +
                            `Dates: ${formattedDateRange.value}\n` +
                            `Price per night: CHF ${formatNumber(room.value.price_per_night)}\n` +
                            `Number of nights: ${formatNumber(totalNights.value)}\n` +
                            `Total price: CHF ${formatNumber(room.value.price_per_night * totalNights.value)}\n\n` +
                            (message.value ? `Message from guest: ${message.value}\n\n` : '') +
                            `Payment method: ${paymentMethod.value}\n\n` +
                            `Please contact the guest to confirm the booking.\n\nGPTeam`
                    };
                    const notificationResponse = await mailService.sendEmail(notificationEmail);
                    if (notificationResponse.status === 'success') {
                        notify('Booking notification email sent successfully.', 'green');
                    } else {
                        notify('Failed to send notification email to the host: ' + notificationResponse.message, 'red');
                    }  
                } else {
                    notify('Booking creation failed: ' + bookingResponse.message, 'red');
                }

            } catch (error) {
                notify('An error occurred during booking: ' + error.message, 'red');
            }
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
            dialogPosition,
            formatNumber,
            getOwner,
            disableDates(date){
                    return !tempBookRange.value.includes(date);
                },
        };
    }
  }
  </script>
  