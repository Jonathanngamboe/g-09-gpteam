import api from './api';

const endpoint = '/images';

export default {
    getAllImages() {
        return api.get(endpoint)
            .then(response => response.data)
            .catch(error => {
                throw new Error('Failed to fetch images: ' + error.message);
            });
    },
    
    getImageById(id) {
        return api.get(`${endpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch image with ID ${id}: ` + error.message);
            });
    },
    
    createImage(imageData) {
        return api.post(endpoint, imageData)
            .then(response => response.data)
            .catch(error => {
                throw new Error('Failed to create image: ' + error.message);
            });
    },
    
    updateImage(id, imageData) {
        return api.put(`${endpoint}/${id}`, imageData)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to update image with ID ${id}: ` + error.message);
            });
    },
    
    deleteImage(id) {
        return api.delete(`${endpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to delete image with ID ${id}: ` + error.message);
            });
    }
};
