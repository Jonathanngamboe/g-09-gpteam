import api from './api';

const endpoint = '/unavailabilities';

export default {
    getUnavailableById(id) {
        return api.get(`${endpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch unavailable with ID ${id}: ` + error.message);
            });
    },
    getUnavailableByPropertyId(propertyId) {
        return api.get(`${endpoint}/properties/${propertyId}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch unavailable with property ID ${propertyId}: ` + error.message);
            });
    },
    getUnavailableDates(){
        return api.get(`${endpoint}`)
            .then(response => {
                // Get all reservations
                const unavailabilities = response.data;

                // Create an array to store the booked dates
                const unavailableDates = unavailabilities.map(unavailability => ({
                    startDate: unavailability.startDate,
                    endDate: unavailability.endDate
                }));
                return unavailableDates;
            })
            .catch(error => {
                throw new Error('Failed to fetch unavailabilities: ' + error.message);
            });
    },
    createUnavailable(unavailableData) {
        return api.post(`${endpoint}`, unavailableData)
            .then(response => response.data)
            .catch(error => {
                throw new Error('Failed to create unavailable: ' + error.message);
            });
    },
    updateUnavailable(id, unavailableData) {
        return api.put(`${endpoint}/${id}`, unavailableData)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to update unavailable with ID ${id}: ` + error.message);
            });
    },
    deleteUnavailable(id) {
        return api.delete(`${endpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to delete unavailable with ID ${id}: ` + error.message);
            });
    }
}