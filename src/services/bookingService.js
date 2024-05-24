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
    //Method to retrieve the bookings of a specifi property
    getBookedDatesByProperty(propertyId){
        const propertyEndpoint = `/properties/${propertyId}/`;
    
        return api.get(propertyEndpoint)
            .then(response => {
                const propertyData = response.data;
                const bookingUrls = propertyData.bookings;
                const bookingPromises = bookingUrls.map(bookingUrl => api.get(bookingUrl));
                return Promise.all(bookingPromises)
                    .then(bookingResponses => {
                        const dates = [];
                        bookingResponses.forEach(response => {
                            const bookingData = response.data;
                            let check_in = new Date(bookingData.check_in);
                            let check_out = new Date(bookingData.check_out);

                            //Add the check-in, check-out and middle dates to the array
                            dates.push(check_in.toISOString().split('T')[0]);

                            for(let date = new Date(check_in.getTime() + 24*60*60*1000); date < check_out; date.setDate(date.getDate() + 1)) {
                                dates.push(date.toISOString().split('T')[0]);
                            }

                            dates.push(check_out.toISOString().split('T')[0]);
                        });
                        return dates;
                    })
                    .catch(error => {
                        throw new Error('Failed to fetch the property bookings, (bookingService): ' + error.message);
                    });
            })
            .catch(error => {
                throw new Error('Failed to fetch property data: ' + error.message);
            });
    }
    /*getUserBookings(userId) {
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
    },

    updateBookingStatus(booking) {
        // Post request to update the booking status
        return api.post(`${endpoint}update-status/`, booking)
            .then(response => response.data)
            .catch(error => {
                throw new Error('Failed to update booking status: ' + error.message);
            });        
    }*/
};