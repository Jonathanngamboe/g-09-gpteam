import api from './api';

const endpoint = '/amenities';

export default {
    getAllAmenities() {
        return api.get(endpoint)
        .then(response => response.data)
        .catch(error => {
            throw new Error('Failed to fetch amenities: ' + error.message);
        });
    },
    
    getAmenityById(id) {
        return api.get(`${endpoint}/${id}`)
        .then(response => response.data)
        .catch(error => {
            throw new Error(`Failed to fetch amenity with ID ${id}: ` + error.message);
        });
    },
    
    createAmenity(amenityData) {
        return api.post(endpoint, amenityData)
        .then(response => response.data)
        .catch(error => {
            throw new Error('Failed to create amenity: ' + error.message);
        });
    },
    
    updateAmenity(id, amenityData) {
        return api.put(`${endpoint}/${id}`, amenityData)
        .then(response => response.data)
        .catch(error => {
            throw new Error(`Failed to update amenity with ID ${id}: ` + error.message);
        });
    },
    
    deleteAmenity(id) {
        return api.delete(`${endpoint}/${id}`)
        .then(response => response.data)
        .catch(error => {
            throw new Error(`Failed to delete amenity with ID ${id}: ` + error.message);
        });
    }
    };

