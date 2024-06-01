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
    },
    //Method to retrieve the unavailabilities of a specific property
    getUnavailableDatesByProperty(propertyId){
        const propertyEndpoint = `/properties/${propertyId}/`;
        return api.get(propertyEndpoint)
            .then(response => {
                const propertyData = response.data;
                const unavailableUrls = propertyData.unavailabilities;
                const unavailablePromises = unavailableUrls.map(unavailableUrls => api.get(unavailableUrls));
                return Promise.all(unavailablePromises)
                    .then(unavailableResponses => {
                        const dates = [];
                        unavailableResponses.forEach(response => {
                            const unavailableData = response.data;
                            let start_date = new Date(unavailableData.start_date);
                            let end_date = new Date(unavailableData.end_date);

                            //Add the start and end date to the dates array
                            dates.push({ start: start_date.toISOString().split('T')[0].replace(/-/g, '/'), end: end_date.toISOString().split('T')[0].replace(/-/g, '/')});
                        });
                        return dates;
                    })
                    .catch(error => {
                        throw new Error('Failled to fetch the property unavailabilities: ' + error.message);
                    });
            })
            .catch(error => {
                throw new Error('Failed to fetch property data: ' + error.message)
            });
    }
}