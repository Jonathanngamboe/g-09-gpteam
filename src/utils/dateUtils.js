import { ref, computed } from 'vue';
import bookingService from '@/services/bookingService';

export function getMinCheckoutDate(checkIn) {
    return computed(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayPlusOne = new Date();
        todayPlusOne.setDate(today.getDate() + 1); // Set to tomorrow

        let latestDate = todayPlusOne; // Default to tomorrow

        if (checkIn.value) {
            const dayAfterCheckIn = new Date(new Date(checkIn.value).getTime() + (24 * 3600 * 1000));
            latestDate = new Date(Math.max(dayAfterCheckIn.getTime(), todayPlusOne.getTime()));
        }

        return latestDate.toISOString().split('T')[0]; // Convert back to ISO string for the input min attribute
    });
}

export function getCheckInRules(minDate) {
    return computed(() => [
        val => !!val || 'Check-in date is required',
        val => new Date(val) >= new Date(minDate.value) || 'Check-in cannot be in the past'
    ]);
}

export function getCheckOutRules(checkIn) {
    return computed(() => [
        val => !!val || 'Check-out date is required',
        val => new Date(val) > new Date(checkIn.value) || 'Check-out must be after check-in'
    ]);
}
export function getBookedDates(propertyId){
    const bookings = ref([]);

    bookingService.getBookedDatesByProperty(propertyId)
        .then(fetchedBookings => {
            bookings.check_in = fetchedBookings.filter((_, index) => index % 2 === 0);
            bookings.check_out = fetchedBookings.filter((_, index) => index % 2 === 1);
        })
        .catch(error => {
            console.error('Failed to fetch property bookings (dateUtils): ' + error.message);
        });
        return bookings;
}
export function getUnavailableDates(){
    return computed(() => [

    ]);
}

export function getDateOptions(unavailableDates) {
    return computed(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);  

        return (date) => {
            const checkDate = new Date(date);
            if (checkDate < today) {
                return false; 
            }

            for (let i = 0; i < unavailableDates.value.length; i++) {
                const entry = unavailableDates.value[i];
                if (typeof entry === 'string') {
                    if (entry === date) {
                        return false; 
                    }
                } else if (entry.start && entry.end) {
                    const startDate = new Date(entry.start);
                    const endDate = new Date(entry.end);
                    if (checkDate >= startDate && checkDate <= endDate) {
                        return false;
                    }
                }
            }

            return true; 
        };
    });
}
