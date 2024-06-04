import api from './api';

const endpoint = 'unavailabilities/';

export default {
    getUnavailableById(id) {
        return api.get(`${endpoint}${id}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch unavailable with ID ${id}: ` + error.message);
            });
    },
    getUnavailableByPropertyId(propertyId) {
        return api.get(`${endpoint}property/${propertyId}`)
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
        return api.put(`${endpoint}${id}/`, unavailableData)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to update unavailable with ID ${id}: ` + error.message);
            });
    },
    deleteUnavailable(id) {
        return api.delete(`${endpoint}${id}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to delete unavailable with ID ${id}: ` + error.message);
            });
    },
    getUnavailableDatesByPropertyArray(propertyId){
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

                            //Add the check-in, check-out and middle dates to the array
                            dates.push(start_date.toISOString().split('T')[0].replace(/-/g, '/'));

                            for(let date = new Date(start_date.getTime() + 24*60*60*1000); date < end_date; date.setDate(date.getDate() + 1)) {
                                dates.push(date.toISOString().split('T')[0].replace(/-/g, '/'));
                            }
                            dates.push(end_date.toISOString().split('T')[0].replace(/-/g, '/'));
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
                            dates.push({ start: start_date.toISOString().split('T')[0].replace(/-/g, '/'), end: end_date.toISOString().split('T')[0].replace(/-/g, '/'), id: unavailableData.id, comment: unavailableData.comment });
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
    },

    formatDate(date) {
        const d = new Date(date);
        return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    },
    
    deleteUnavailableByDate(propertyId, propertyUrl, date) {
        return this.getUnavailableDatesByProperty(propertyId)
            .then(unavailabilities => {
                //console.log("Initial unavailabilities:", unavailabilities);
                //console.log("Target date to delete:", date);
    
                const targetDate = new Date(date);
                const formattedTargetDate = this.formatDate(targetDate);
    
                const promises = unavailabilities.map(unavailability => {
                    const startDate = new Date(unavailability.start);
                    const endDate = new Date(unavailability.end);
                    const formattedStartDate = this.formatDate(startDate);
                    const formattedEndDate = this.formatDate(endDate);
    
                    //console.log("Processing unavailability:", unavailability.id, "from", formattedStartDate, "to", formattedEndDate);

                    //console.log("Formatted target date:", formattedTargetDate);
                    //console.log("Formatted start date:", formattedStartDate);
    
                    if (formattedTargetDate === formattedStartDate) {
                        if (formattedStartDate === formattedEndDate) {
                            //console.log("Deleting single-day unavailability for date:", formattedStartDate);
                            return api.delete(`${endpoint}${unavailability.id}`);
                        } else {
                            const newStartDate = new Date(startDate.setDate(startDate.getDate() + 1));
                            const formattedNewStartDate = this.formatDate(newStartDate);
                            //console.log("Updating start date from", formattedStartDate, "to", formattedNewStartDate);
                            return this.updateUnavailable(unavailability.id, { start_date: formattedNewStartDate, end_date: formattedEndDate, property: propertyUrl, comment: unavailability.comment });
                        }
                    } else if (formattedTargetDate === formattedEndDate) {
                        const newEndDate = new Date(endDate.setDate(endDate.getDate() - 1));
                        const formattedNewEndDate = this.formatDate(newEndDate);
                        //console.log("Updating end date from", formattedEndDate, "to", formattedNewEndDate);
                        return this.updateUnavailable(unavailability.id, { start_date: formattedStartDate, end_date: formattedNewEndDate, property: propertyUrl, comment: unavailability.comment });
                    } else if (targetDate > startDate && targetDate < endDate) {
                        // Nouvelle fin pour la première plage: la veille de la date cible
                        const newEndDate1 = new Date(targetDate.getTime() - 86400000); // un jour avant
                        const formattedNewEndDate1 = this.formatDate(newEndDate1);
                    
                        // Nouveau début pour la deuxième plage: le lendemain de la date cible
                        const newStartDate2 = new Date(targetDate.getTime() + 86400000); // un jour après
                        const formattedNewStartDate2 = this.formatDate(newStartDate2);
                    
                        //console.log("Splitting unavailability from", formattedStartDate, "to", formattedEndDate, "into two parts:", formattedStartDate, "to", formattedNewEndDate1, "and", formattedNewStartDate2, "to", formattedEndDate);


                        // Delete the current unavailability and create two new ones
                        return this.deleteUnavailable(unavailability.id)
                            .then(() => this.createUnavailable({ start_date: formattedStartDate, end_date: formattedNewEndDate1, property: propertyUrl, comment: unavailability.comment }))
                            .then(() => this.createUnavailable({ start_date: formattedNewStartDate2, end_date: formattedEndDate, property: propertyUrl, comment: unavailability.comment }));

                    }                    
    
                    return Promise.resolve();
                });
    
                return Promise.all(promises);
            })
            .then(results => {
                return results.filter(result => result !== undefined);
            })
            .catch(error => {
                throw new Error(error.message);
            });
    }                
    
}