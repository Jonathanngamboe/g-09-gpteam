import api from './api';

const endpoint = '/cities';

export default {
    getAllCities() {
        return api.get(endpoint)
            .then(response => response.data)
            .catch(error => {
                throw new Error('Failed to fetch cities: ' + error.message);
            });
    },
    
    getCityById(id) {
        return api.get(`${endpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch city with ID ${id}: ` + error.message);
            });
    },
    
    createCity(cityName, zipCode ) {
        const cityData = {
            name: cityName,
            zip: zipCode
        };
        return api.post(endpoint, cityData)
            .then(response => response.data)
            .catch(error => {
                throw new Error('Failed to create city: ' + error.message);
            });
    },
    
    updateCity(id, cityData) {
        return api.put(`${endpoint}/${id}`, cityData)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to update city with ID ${id}: ` + error.message);
            });
    },
    
    deleteCity(id) {
        return api.delete(`${endpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to delete city with ID ${id}: ` + error.message);
            });
    },
    getCityByName(name) {
        return api.get(`${endpoint}?name=${name}`)
            .then(response => {
                if (response.data && response.data.length > 0) {
                    return response.data[0];  // Assume che la risposta sia un array di città
                }
                return null;  // Nessuna città trovata
            })
            .catch(error => {
                throw new Error(`Failed to fetch city by name ${name}: ` + error.message);
            });
    }
};
