<template>
    <!-- Booking History Timeline -->
    <div class="q-pa-md items-center">
        <!-- User's Booking History Timeline -->
        <q-timeline v-if="userBookings.length > 0">
            <q-timeline-entry
                v-for="booking in userBookings"
                :key="booking.id"
                :color="getStatusColor(extractStatusFromUrl(booking.status))" 
                :icon="getIcon(extractStatusFromUrl(booking.status))"
                :title="booking.property.title + ', booking from ' + new Date(booking.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })"
                :subtitle="extractStatusFromUrl(booking.status)"
                :body="new Date(booking.check_in).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) + ' - ' + new Date(booking.check_out).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })"
            >
                <div class="q-mt-md">
                    <q-btn
                        v-if="extractStatusFromUrl(booking.status) === 'confirmed'"
                        unelevated
                        rounded
                        color="negative"
                        label="Cancel"
                        icon="cancel"
                        @click="updateBookingStatus(booking.id, 'Cancelled')"
                    />
                </div>
            </q-timeline-entry>
        </q-timeline>
        <div v-else-if="!userBookings" class="row justify-center q-gutter-md">
            <div class="text-h6 full-width text-center">You have no bookings yet. Click the button below to book a property.</div>
            <q-btn
                unelevated
                rounded
                color="primary"
                label="Search Properties"
                @click="bookProperty"
            />
        </div>
        <!-- Room Booking History Timeline -->
        <q-timeline v-else-if="roomBookings.length > 0">
            <q-timeline-entry
                v-for="booking in roomBookings"
                :key="booking.id"
                :color="getStatusColor(extractStatusFromUrl(booking.status))" 
                :icon="getIcon(extractStatusFromUrl(booking.status))"
                :title="booking.user.first_name + ' ' + booking.user.last_name + ', booking from ' + new Date(booking.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })"
                :subtitle="extractStatusFromUrl(booking.status)"
                :body="new Date(booking.check_in).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) + ' - ' + new Date(booking.check_out).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })"
            >
                <!-- Buttons to approve, reject or cancel booking -->
                <div class="q-gutter-md q-mt-md">
                    <q-btn
                        v-if="extractStatusFromUrl(booking.status) === 'pending'"
                        unelevated
                        rounded
                        color="positive"
                        label="Accept"
                        icon="check"
                        @click="updateBookingStatus(booking.id, 'Confirmed')"
                    />
                    <q-btn
                        v-if="extractStatusFromUrl(booking.status) === 'pending' || extractStatusFromUrl(booking.status) === 'confirmed'"
                        unelevated
                        rounded
                        color="negative"
                        :label="extractStatusFromUrl(booking.status) === 'pending' ? 'Reject' : 'Cancel'"
                        icon="cancel"
                        @click="updateBookingStatus(booking.id, 'Cancelled')"
                    />
                </div>
            </q-timeline-entry>
        </q-timeline>
        <div v-else-if="!roomBookings" class="row justify-center q-gutter-md">
            <div class="text-h6 full-width text-center">No bookings have been made for this room yet.</div>
        </div>
    </div>
</template>

<script>
    import { ref, onMounted } from 'vue';
    import authService from '@/services/authService';
    import bookingService from '@/services/bookingService';
    import propertyService from '@/services/propertyService';
    import { useRouter } from 'vue-router';
    import { useQuasar } from 'quasar';

    export default {
        props: {
            user: {
                type: Object,
                required: false
            },
            room: {
                type: Object,
                required: false
            }
        },
        setup(props) {
            const roomBookings = ref([]);
            const userBookings = ref([]);   
            const router = useRouter();
            const $q = useQuasar();
            
            const fetchBookings = async () => {
                if(props.room) {
                    try {
                        // Fetch room bookings
                        roomBookings.value = await bookingService.getRoomBookings(props.room.id);
                        // Enrich bookings with user details
                        roomBookings.value = await getUserInBooking(roomBookings.value);
                        // Sort bookings by created_at date from newest to oldest
                        roomBookings.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    } catch (error) {
                        $q.notify({
                            color: 'negative',
                            position: 'top',
                            message: `Failed to fetch room bookings: ${error.message}`
                        });
                    }
                } else if(props.user) {
                    try {
                        // Fetch user bookings
                        userBookings.value = await bookingService.getUserBookings(props.user.pk);
                        // Enrich bookings with property details
                        userBookings.value = await getBookingsProperty(userBookings.value);
                        // Sort bookings by created_at date from newest to oldest
                        userBookings.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    } catch (error) {
                        $q.notify({
                            color: 'negative',
                            position: 'top',
                            message: `Failed to fetch user's bookings: ${error.message}`
                        });
                    }
                }
            };

            const getUserInBooking = async (roombookings) => {
                try {
                    const promises = roombookings.map(async (booking) => {
                        const userDetails = await authService.getUserByUrl(booking.user);
                        return { ...booking, user: userDetails };
                    });
                    const bookingsWithUserDetails = await Promise.allSettled(promises);
                    const validBookings = bookingsWithUserDetails.map(result => 
                        result.status === 'fulfilled' ? result.value : result.reason
                    );
                    return validBookings;
                } catch (error) {
                    $q.notify({
                        color: 'negative',
                        position: 'top',
                        message: `Failed to fetch user details: ${error.message}`
                    });
                }
            }

            const getBookingsProperty = async (userBookings) => {
                try {
                    const promises = userBookings.map(async (booking) => {
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
                const decodedUrl = decodeURIComponent(url).toLowerCase();
                const match = decodedUrl.match(/\/api\/statuses\/([a-z\s]+)\/?$/);
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
                router.push('/');
            }

            onMounted(() => {
                fetchBookings();
            });

            const updateBookingStatus = async (bookingId, status) => {
                try {
                    const booking = {
                        bookingId: bookingId,
                        statusName: status
                    };
                    await bookingService.updateBookingStatus(booking);
                    fetchBookings();
                } catch (error) {
                    $q.notify({
                        color: 'negative',
                        position: 'top',
                        message: `Failed to update booking status: ${error.message}`
                    });
                }
            }

            return {
                userBookings,
                roomBookings,
                bookProperty,
                extractStatusFromUrl,
                getStatusColor,
                getIcon,
                updateBookingStatus
            };
        },
    };
</script>