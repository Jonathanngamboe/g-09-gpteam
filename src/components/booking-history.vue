<template>
    <!-- Booking History Timeline -->
    <div class="q-pa-md items-center" v-if="dataLoaded">
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
        <!-- User's Booking History Timeline -->
        <q-timeline v-if="userBookings.length > 0">
            <q-timeline-entry
                v-for="booking in userBookings"
                :key="booking.id"
                :color="getStatusColor(extractStatusFromUrl(booking.status))" 
                :icon="getIcon(extractStatusFromUrl(booking.status))"
                :title="booking.property.title + ', booked on ' + new Date(booking.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })"
                :subtitle="extractStatusFromUrl(booking.status)"
                :body="new Date(booking.check_in).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) + ' - ' + new Date(booking.check_out).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })"
            >
                <div class="q-mt-md">
                    <img :src="booking.property.images ? booking.property.images[0].image_url || booking.property.images[0].ext_url : ''" alt="Property image" class="room-image" style="width: auto; height: 120px; object-fit: cover;">
                </div>
                <div class="q-mt-xs">
                    <q-btn
                        v-if="extractStatusFromUrl(booking.status) === 'confirmed'"
                        unelevated
                        rounded
                        color="negative"
                        label="Cancel"
                        icon="cancel"
                        @click="updateBookingStatus(booking.id, 'Cancelled')"
                    />
                    <q-btn
                        v-if="!booking.reviewed && extractStatusFromUrl(booking.status) === 'completed'"
                        unelevated
                        rounded
                        color="primary"
                        label="Leave a Review"
                        icon="rate_review"
                        @click="showReviewDialog = true, reviewType = 'property', selectedBookingUrl = booking.url"
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
                :title="booking.property.title + ', booked by ' + booking.user.first_name + ' ' + booking.user.last_name + ', on ' + new Date(booking.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })"
                :subtitle="extractStatusFromUrl(booking.status)"
                :body="new Date(booking.check_in).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) + ' - ' + new Date(booking.check_out).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })"
>
                <!-- User name clickable -->
                <div class="cursor-pointer q-mt-md" @click="showUserReviewsDialog = true, userSelected = booking.user" v-if="booking.property.reviews.length > 0">
                    <q-chip icon="person" :label="booking.user.first_name + ' ' + booking.user.last_name + '´s reviews'"></q-chip>
                </div>

                <div class="q-mt-md">
                    <img :src="booking.property.images ? booking.property.images[0].image_url || booking.property.images[0].ext_url : ''" alt="Property image" class="room-image" style="width: auto; height: 120px; object-fit: cover;">
                </div>
                <!-- Buttons to approve, reject or cancel booking -->
                <div class="q-gutter-md q-mt-xs">
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
                    <q-btn
                        v-if="!booking.reviewed && extractStatusFromUrl(booking.status) === 'completed'"
                        unelevated
                        rounded
                        color="primary"
                        label="Leave a Review"
                        icon="rate_review"
                        @click="showReviewDialog = true, reviewType = 'guest', selectedBookingUrl = booking.url"                  
                    />
                </div>
            </q-timeline-entry>
        </q-timeline>
        <div v-else-if="!roomBookings" class="row justify-center q-gutter-md">
            <div class="text-h6 full-width text-center">No bookings have been made for this room yet.</div>
        </div>
    </div>
    <div v-else class="text-center q-pa-md text-h6 full-width full-height bg-white text-primary">
        Loading...
    </div>
    <!-- Write Review Dialog -->
    <WriteReview 
        :visible="showReviewDialog" 
        @update:visible="val => showReviewDialog = val" 
        @review-submitted="handleReviewFinished"
        :reviewType="reviewType" 
        :bookingUrl="selectedBookingUrl" 
    />
    <!-- User Reviews Dialog -->
    <UserReviewsDialog 
        :user="userSelected" 
        :visible="showUserReviewsDialog"
        @update:visible="val => showUserReviewsDialog = val"
    />
</template>

<script>
    import { ref, onMounted } from 'vue';
    import authService from '@/services/authService';
    import bookingService from '@/services/bookingService';
    import propertyService from '@/services/propertyService';
    import { useRouter } from 'vue-router';
    import { useQuasar } from 'quasar';
    import WriteReview from './WriteReview.vue';
    import reviewService from '@/services/reviewService';
    import UserReviewsDialog from './UserReviewsDialog.vue';

    export default {
        props: {
            user: {
                type: Object,
                required: false
            },
            room: {
                type: Object,
                required: false
            }, 
            rooms: {
                type: Array,
                default: () => []
            }
        },
        components: {
            WriteReview,
            UserReviewsDialog
        },
        setup(props) {
            // Initialize roomBokings with reviewed status as false
            const originalUserBookings = ref([]);
            const originalRoomBookings = ref([]);
            const roomBookings = ref([]);
            const userBookings = ref([]);   
            const router = useRouter();
            const $q = useQuasar();
            const showReviewDialog = ref(false);
            const reviewType = ref('');
            const selectedBookingUrl = ref('');  
            const showUserReviewsDialog = ref(false);
            const userSelected = ref({});
            const dataLoaded = ref(false);
            const activeFilter = ref(null);
            const filterOptions = ref([
                { label: 'All', value: 'all' },
                { label: 'Confirmed', value: 'confirmed' },
                { label: 'Cancelled', value: 'cancelled' },
                { label: 'Completed', value: 'completed' },
                { label: 'In Progress', value: 'in progress' },
                { label: 'Pending', value: 'pending' },
            ]);
            const sortOptions = [
                { label: 'Newest First', value: 'newest' },
                { label: 'Oldest First', value: 'oldest' }
            ];

            const applyFilter = (filter) => {
                activeFilter.value = filter.value;
                if (filter.value === 'all') {
                    userBookings.value = [...originalUserBookings.value];
                    roomBookings.value = [...originalRoomBookings.value];
                } else {
                    userBookings.value = originalUserBookings.value.filter(booking => extractStatusFromUrl(booking.status) === filter.value);
                    roomBookings.value = originalRoomBookings.value.filter(booking => extractStatusFromUrl(booking.status) === filter.value);
                }
            };

            const resetFilters = () => {
                applyFilter({ value: 'all' });
            };

            const applySort = (option) => {
                if (!option || !option.value) {
                    $q.notify({
                    color: 'negative',
                    position: 'top',
                    message: 'Invalid sort option selected.',
                    icon: 'error'
                    });
                    return;
                }
                if (option.value === 'newest') {
                    userBookings.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    roomBookings.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                } else if (option.value === 'oldest') {
                    userBookings.value.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    roomBookings.value.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                }
            };
            
            const fetchBookings = async () => {
                if (props.rooms.length > 0) {
                    try {
                        const allRoomBookings = await Promise.all(props.rooms.map(room => 
                            bookingService.getRoomBookings(room.id)
                        ));

                        originalRoomBookings.value = allRoomBookings.flat().map(booking => {
                            const matchedRoom = props.rooms.find(room => room.url === booking.property);
                            return { ...booking, property: matchedRoom };
                        });

                        // Enrich bookings with user details
                        originalRoomBookings.value = await getUserInBooking(originalRoomBookings.value);
                        // Enrich bookings with review status
                        originalRoomBookings.value = await enrichBookingWithReviewStatus(originalRoomBookings.value, 'guest')
                        // Sort bookings
                        originalRoomBookings.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    } catch (error) {
                        $q.notify({
                            color: 'negative',
                            position: 'top',
                            message: `Failed to fetch room bookings: ${error.message}`
                        });
                    }
                }
                else if(props.room) {
                    try {
                        // Fetch room bookings
                        originalRoomBookings.value = await bookingService.getRoomBookings(props.room.id);
                        // Enrich bookings with property details
                        originalRoomBookings.value = originalRoomBookings.value.map(booking => {
                            return { ...booking, property: props.room };
                        });
                        // Enrich bookings with user details
                        originalRoomBookings.value = await getUserInBooking(originalRoomBookings.value);
                        // Enrich bookings with review status
                        originalRoomBookings.value = await enrichBookingWithReviewStatus(originalRoomBookings.value, 'guest');
                        // Sort bookings by created_at date from newest to oldest
                        originalRoomBookings.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
                        originalUserBookings.value = await bookingService.getUserBookings(props.user.pk);
                        // Enrich bookings with property details
                        originalUserBookings.value = await getBookingsProperty(originalUserBookings.value);
                        // Enrich bookings with review status
                        originalUserBookings.value = await enrichBookingWithReviewStatus(originalUserBookings.value, 'property');
                        // Sort bookings by created_at date from newest to oldest
                        originalUserBookings.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    } catch (error) {
                        $q.notify({
                            color: 'negative',
                            position: 'top',
                            message: `Failed to fetch user's bookings: ${error.message}`
                        });
                    }
                }
                resetFilters();
                dataLoaded.value = true;
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

            const enrichBookingWithReviewStatus = async (bookings, reviewType) => {
                for (const booking of bookings) {
                    booking.reviewed = await hasReviewed(booking, reviewType);
                }
                return bookings;
            };

            const hasReviewed = async (booking, reviewType) => {
                try {
                    const reviews = await reviewService.getReviewsByBooking(booking.id);

                    return reviews.some(review => {
                        const userMatch = review.user && review.user.id === props.user.pk;
                        const reviewTypeMatch = review.review_type === reviewType;
                        return userMatch && reviewTypeMatch;
                    });
                } catch (error) {
                    $q.notify({
                        color: 'negative',
                        position: 'top',
                        message: `Failed to check if booking has been reviewed: ${error.message}`
                    });
                    return false;
                }
            };

            const handleReviewFinished = async (bookingUrl) => {
                // Find the specific booking
                let updated = false;
                for (let booking of [...userBookings.value, ...roomBookings.value]) {
                    if (booking.url === bookingUrl) {
                        // Re-check if the booking has been reviewed
                        const hasBeenReviewed = await hasReviewed(booking, booking.reviewType || 'property'); // ensure default type
                        booking.reviewed = hasBeenReviewed;
                        updated = true;
                    }
                }
                if (updated) {
                    // Force update the reactivity in Vue
                    userBookings.value = [...userBookings.value];
                    roomBookings.value = [...roomBookings.value];
                }
            };
            
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
                updateBookingStatus,
                router,
                showReviewDialog,
                reviewType,
                selectedBookingUrl,
                handleReviewFinished,
                showUserReviewsDialog,
                userSelected,
                dataLoaded,
                sortOptions,
                applySort,
                filterOptions,
                applyFilter,
                activeFilter,
                resetFilters
            };
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