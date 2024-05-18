<template>
    <!-- Booking History Timeline -->
    <div class="q-pa-md items-center">
        <q-timeline v-if="bookings.length > 0">
            <q-timeline-entry
                v-for="booking in bookings"
                :key="booking.id"
                :color="getStatusColor(extractStatusFromUrl(booking.status))" 
                :icon="getIcon(extractStatusFromUrl(booking.status))"
                :title="booking.property.title"
                :subtitle="extractStatusFromUrl(booking.status)"
                :body="booking.check_in + ' - ' + booking.check_out"
            >
            </q-timeline-entry>
        </q-timeline>
        <div v-else class="row justify-center q-gutter-md">
            <div class="text-h6 full-width text-center">You have no bookings yet. Click the button below to book a property.</div>
            <q-btn
                unelevated
                rounded
                color="primary"
                label="Search Properties"
                @click="bookProperty"
            />
        </div>
    </div>
</template>

<script>
    import { ref, onMounted } from 'vue';
    import bookingService from '@/services/bookingService';
    import propertyService from '@/services/propertyService';
    import { useRouter } from 'vue-router';
    import { useQuasar } from 'quasar';

    export default {
        props: {
            user: Object,
        },
        setup(props) {
            const bookings = ref([]);   
            const router = useRouter();
            const $q = useQuasar();

            const fetchBookings = async () => {
                try {
                    // Fetch user bookings
                    bookings.value = await bookingService.getUserBookings(props.user.pk);
                    // Enrich bookings with property details
                    bookings.value = await getBookingsProperty(bookings.value);
                } catch (error) {
                    $q.notify({
                        color: 'negative',
                        position: 'top',
                        message: `Failed to fetch bookings: ${error.message}`
                    });
                }
            };

            const getBookingsProperty = async (bookings) => {
                try {
                    const promises = bookings.map(async (booking) => {
                        try {
                            const propertyDetails = await propertyService.getPropertyByUrl(booking.property);
                            return { ...booking, property: propertyDetails };
                        } catch (error) {
                            $q.notify({
                                color: 'negative',
                                position: 'top',
                                message: `Failed to fetch property details: ${error.message}`
                            });
                            return { ...booking, property: null };
                        }
                    });

                    const bookingsWithPropertyDetails = await Promise.allSettled(promises);
                    const validBookings = bookingsWithPropertyDetails.map(result => 
                        result.status === 'fulfilled' ? result.value : result.reason
                    );
                    return validBookings;
                } catch (error) {
                    $q.notify({
                        color: 'negative',
                        position: 'top',
                        message: `Failed to fetch property details: ${error.message}`
                    });
                }
            }
            
            function extractStatusFromUrl(url) {
                const normalizedUrl = url.toLowerCase();
                const match = normalizedUrl.match(/\/api\/statuses\/([a-z]+)\/?$/);
                return match ? match[1] : null;
            }

            function getStatusColor(status) {
                switch (status.toLowerCase()) {
                    case 'completed':
                    return 'positive'; 
                    case 'cancelled':
                    return 'negative'; 
                    case 'in progress':
                    return 'warning'; 
                    case 'confirmed':
                    return 'info';
                    case 'pending':
                    return 'grey-8';
                    default:
                    return 'primary'; 
                }
            }

            function getIcon(status) {
                switch (status.toLowerCase()) {
                    case 'completed':
                    return 'check_circle'; 
                    case 'cancelled':
                    return 'cancel'; 
                    case 'in progress':
                    return 'hourglass_empty'; 
                    case 'confirmed':
                    return 'check'; 
                    case 'pending':
                    return 'schedule';
                    default:
                    return 'info'; 
                }
            }

            function bookProperty() {
                router.push({ name: '/' });
            }

            onMounted(() => {
                fetchBookings();
            });

            return {
                bookings,
                bookProperty,
                extractStatusFromUrl,
                getStatusColor,
                getIcon
            };
        },
    };
</script>