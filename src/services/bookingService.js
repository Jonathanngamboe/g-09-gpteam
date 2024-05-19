import api from './api';

const endpoint = 'bookings/';

export default {
    getAllBookings() {
        return api.get(endpoint)
            .then(response => response.data)
            .catch(error => {
                throw new Error('Failed to fetch bookings: ' + error.message);
            });
    },

    getBookingById(id) {
        return api.get(`${endpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch booking with ID ${id}: ` + error.message);
            });
    },

    createBooking(bookingData) {
        return api.post(endpoint, bookingData)
            .then(response => response.data)
            .catch(error => {
                if (error.response) {
                    throw new Error(error.response.data.error);
                } else {
                    // For network errors or other issues where the server doesn't respond with JSON
                    throw new Error('Network error or server did not respond with error details');
                }
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
    },

    getUserBookings(userId) {
        return api.get(`${endpoint}user-bookings/${userId}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch bookings for user with ID ${userId}: ` + error.message);
            });
    },

    getRoomBookings(roomId) {
        return api.get(`${endpoint}room-bookings/${roomId}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch bookings for room with ID ${roomId}: ` + error.message);
            });
    }
};