import api from './api';

const endpoint = '/property_types';

export default {
    getAllPropertyTypes() {
        return api.get(endpoint)
            .then(response => response.data)
            .catch(error => {
                throw new Error('Failed to fetch property types: ' + error.message);
            });
    },
    
    getPropertyTypeById(id) {
        return api.get(`${endpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch property type with ID ${id}: ` + error.message);
            });
    },
    
    createPropertyType(propertyTypeData) {
        return api.post(endpoint, propertyTypeData)
            .then(response => response.data)
            .catch(error => {
                throw new Error('Failed to create property type: ' + error.message);
            });
    },
    
    updatePropertyType(id, propertyTypeData) {
        return api.put(`${endpoint}/${id}`, propertyTypeData)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to update property type with ID ${id}: ` + error.message);
            });
    },
    
    deletePropertyType(id) {
        return api.delete(`${endpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to delete property type with ID ${id}: ` + error.message);
            });
    }
};
