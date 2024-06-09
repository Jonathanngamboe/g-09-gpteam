import { ref, computed } from 'vue';
import bookingService from '@/services/bookingService';
import unavailableService from '@/services/unavailableService';

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

export function getCheckInRules(minDate, bookedDates) {
    return computed(() => [
        val => !!val || 'Check-in date is required',
        val => new Date(val) >= new Date(minDate.value) || 'Check-in cannot be in the past',
        val => !bookedDates.value.includes(val) || 'Property is already booked on this date'
    ]);
}

export function getCheckOutRules(checkIn, bookedDates) {
    return computed(() => [
        val => !!val || 'Check-out date is required',
        val => new Date(val) > new Date(checkIn.value) || 'Check-out must be after check-in',
        val => !bookedDates.value.includes(val) || 'Property is already booked on this date'
    ]);
}
export async function getBookedDates(propertyId){
    let bookingDates = [];

    await bookingService.getBookedDatesByPropertyFromTo(propertyId)
        .then(fetchedBookings => {
            bookingDates = fetchedBookings;
        })
        .catch(error => {
            $q.notify({
                color: 'negative',
                position: 'top',
                message: `Failed to fetch property bookings: ${error.message}`
              });
        });
        return bookingDates;
}
export async function getBookedDatesArray(propertyId){
    let bookings = [];

    await bookingService.getBookedDatesByPropertyArray(propertyId)
        .then(fetchedBookings => {
            bookings = fetchedBookings;
        })
        .catch(error => {
            $q.notify({
                color: 'negative',
                position: 'top',
                message: `Failed to fetch property bookings: ${error.message}`
              });
        });
        return bookings;
}
export async function getUnavailableDates(propertyId){
    let unavailableDates = [];

    await unavailableService.getUnavailableDatesByProperty(propertyId)
        .then(fetchedUnavailableDates => {
            unavailableDates = fetchedUnavailableDates;
        })
        .catch(error => {
            $q.notify({
                color: 'negative',
                position: 'top',
                message: `Failed to fetch property unavailabilities: ${error.message}`
              });
        });
        return unavailableDates;
}
export async function getUnavailableDatesArray(propertyId){
    let unavailableDates = [];

    await unavailableService.getUnavailableDatesByPropertyArray(propertyId)
        .then(fetchedUnavailableDates => {
            unavailableDates = fetchedUnavailableDates;
        })
        .catch(error => {
            $q.notify({
                color: 'negative',
                position: 'top',
                message: `Failed to fetch unavailabilities: ${error.message}`
              });
        });
        return unavailableDates;
}
export function updateUnavailableDates(propertyId, start_date, end_date) {
    const data = {
        start_date: start_date,
        end_date: end_date,
        property: 'http://127.0.0.1:8000/api/properties/' + propertyId + '/'
    }
    unavailableService.createUnavailable(data)
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
