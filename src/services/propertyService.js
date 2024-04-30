import api from "@/services/api";

const propertyService = {
  // Method to add a new property
  addProperty(propertyData) {
    const data = {
      title: propertyData.title,
      description: propertyData.description,
      address: propertyData.address,
      price_per_night: propertyData.price_per_night,
      surface: propertyData.surface,
      is_active: propertyData.is_active,
      owner: propertyData.owner, 
    };

    return api.post('properties/', data)
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },
  
  // Method to retrieve property data
  getProperties() {
    return api.get('properties/')
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  // Method to retrieve the details of a specific property
  getPropertyDetails(propertyId) {
    return api.get(`properties/${propertyId}/`)
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  // Method for updating the data of an existing property
  updateProperty(propertyId, propertyData) {
    const data = {
      title: propertyData.title,
      description: propertyData.description,
      address: propertyData.address,
      price_per_night: propertyData.price_per_night,
      surface: propertyData.surface,
      is_active: propertyData.is_active,
      
    };

    return api.put(`properties/${propertyId}/`, data)
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  // Method to delete a property
  deleteProperty(propertyId) {
    return api.delete(`properties/${propertyId}/`)
      .then(response => response.data)
        .catch(error => Promise.reject(error.response.data));
    },
};

export default propertyService;
