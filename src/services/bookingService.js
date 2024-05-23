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
                consol.log('Property Data:', propertyData)

                const bookingUrls = propertyData.bookings;
                console.log('Booking Urls:', bookingUrls);

                const bookingPromises = bookingUrls.map(bookingUrl => api.get(bookingUrl));
                return Promise.all(bookingPromises)
                    .then(bookingResponses => {
                        return bookingResponses.flatMap(response => {
                            const bookingData = response.data;
                            return [bookingData.check_in, bookingData.check_out];
                        });
                    })
                    .catch(error => {
                        throw new Error('Failed to fetch the property bookings, (bookingService): ' + error.message);
                    });
            })
            .catch(error => {
                throw new Error('Failed to fetch property data: ' + error.message);
            });
    },
    //Method to retrieve the unavailabilities of a specific property
    getUnavailableDatesByProperty(propertyId){
        const propertyEndpoint = `/properties/${propertyId}/`;
        return api.get(propertyEndpoint)
            .then(response => {
                const propertyData = response.data;
                const unavailableUrls = propertyData.properties;
                const unavailablePromises = unavailableUrls.map(unavailableUrls => api.get(unavailableUrls));
                return Promise.all(unavailablePromises)
                    .then(unavailableResponses => unavailableResponses.map(response => response.data))
                    .catch(error => {
                        throw new Error('Failled to fetch the property unavailabilities: ' + error.message);
                    });
            })
            .catch(error => {
                throw new Error('Failed to fetch property data: ' + error.message)
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