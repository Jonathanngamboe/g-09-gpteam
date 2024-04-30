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
    getBookedDates(){
        return api.get(`${endpoint}`)
            .then(response => response.data){
                //Get all reservations
                const bookings = response.data;

                //Create an array to store the dates
                const bookedDates = bookings.map(booking => ({
                    start: booking.checkIn,
                    end: booking.checkOut
            }));

            }
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
