import api from './api'; 

const endpoint = '/bookings';

export default {
    getBookingbyId(id) {
        return api.get(`${endpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch booking with ID ${id}: ` + error.message);
            });
    },
    getBookingByPropertyId(propertyId) {
        return api.get(`${endpoint}/properties/${propertyId}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch booking with property ID ${propertyId}: ` + error.message);
            });
    },
    getBookingByUserId(userId) {
        return api.get(`${endpoint}/customusers/${userId}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch booking with user ID ${userId}: ` + error.message);
            });
    },
    getBookedByStatus(status) {
        return api.get(`${endpoint}/statuses/${status}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch booking with status ${status}: ` + error.message);
            });
    },
    getBookedDates(){
        return api.get(`${endpoint}`)
            .then(response => {
                // Get all reservations
                const bookings = response.data;

                // Create an array to store the booked dates
                const bookedDates = bookings.map(booking => ({
                    startDate: booking.checkIn,
                    endDate: booking.checkOut
                }));
                return bookedDates;
            })
            .catch(error => {
                throw new Error('Failed to fetch bookings: ' + error.message);
            });
    },
    createBooking(bookingData) {
        return api.post('${endpoint}', bookingData)
            .then(response => response.data)
            .catch(error => {
                throw new Error('Failed to create booking: ' + error.message);
            });
    },
    updateBooking(id, bookingData) {
        return api.put(`${endpoint}/${id}`, bookingData)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to update booking with ID ${id}: ` + error.message);
            });
    },
    deleteBooking(id) {
        return api.delete(`${endpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to delete booking with ID ${id}: ` + error.message);
            });
    }

}
