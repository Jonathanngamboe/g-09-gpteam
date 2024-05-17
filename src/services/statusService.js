import api from './api';

const endpoint = '/statuses/';

export default {
    getAllStatus() {
        return api.get(endpoint)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error('Failed to fetch statuses: ' + error.message);
        });
    },
    createStatus(statusData) {
        return api.post(endpoint, statusData)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error('Failed to create status: ' + error.message);
        });
    },
    updateStatus(id, statusData) {
        return api.put(`${endpoint}/${id}`, statusData)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error(`Failed to update status with ID ${id}: ` + error.message);
        });
    },
    deleteStatus(id) {
        return api.delete(`${endpoint}/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error(`Failed to delete status with ID ${id}: ` + error.message);
        });
    },
};