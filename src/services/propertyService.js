import api from "@/services/api";

const endpoint = '/properties';

const propertyService = {

  getPropertyById(id) {
    return api.get(`${endpoint}/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Failed to fetch room with ID ${id}: ` + error.message);
      });
  },

  getPropertyByUrl(propertyUrl) {
    const propertyId = this.extractIdFromUrl(propertyUrl);
    if (!propertyId) {
        throw new Error("Invalid property URL");
    }
    return this.getPropertyById(propertyId);
  },

  extractIdFromUrl(url) {
    const match = url.match(/\/api\/properties\/(\d+)\//);
    return match ? match[1] : null;
  },

  getFilteredProperties(searchCriteria, filters) {
    const params = {
      destination: searchCriteria.destination,
      checkIn: searchCriteria.checkIn,
      checkOut: searchCriteria.checkOut,
      minPrice: filters.priceRange.min,
      maxPrice: filters.priceRange.max !== Infinity ? filters.priceRange.max : 2000,  
      amenities: filters.amenities.join(','),
      minRating: filters.rating.min,
      maxRating: filters.rating.max !== Infinity ? filters.rating.max : 5,
      propertyType: filters.propertyType,
    };
    
    return api.get(endpoint, { params })
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Failed to fetch filtered properties: ` + error.message);
      });
  },

  addProperty(propertyData) {
    const data = {
      title: propertyData.title,
      description: propertyData.description,
      address: propertyData.address,
      city: propertyData.city,
      city_id: propertyData.city_id,
      price_per_night: propertyData.price_per_night,
      surface: propertyData.surface,
      amenities: propertyData.amenities,
      amenities_ids: propertyData.amenities_ids,  
      property_Type: propertyData.property_Type,
      images_ids: propertyData.images_ids,  
      is_active: propertyData.is_active,
      owner: propertyData.owner, 
      bookings: propertyData.bookings,
      unavailabilities: propertyData.unavailabilities,
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

  updateProperty(propertyId, propertyData) {
    return api.patch(`properties/${propertyId}/`, propertyData)
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  deleteProperty(propertyId) {
    return api.delete(`properties/${propertyId}/`)
      .then(response => response.data)
        .catch(error => Promise.reject(error.response.data));
  },

  // Method to retrieve the properties of a specific user
  getUserProperties(userId) {
    const userEndpoint = `/customusers/${userId}/`;

    return api.get(userEndpoint)
      .then(response => {
        const userData = response.data;
        const propertyUrls = userData.properties;
        const propertyPromises = propertyUrls.map(propertyUrl => api.get(propertyUrl));
        return Promise.all(propertyPromises)
          .then(propertyResponses => propertyResponses.map(response => response.data))
          .catch(error => {
            throw new Error('Failed to fetch user properties: ' + error.message);
          });
      })
      .catch(error => {
        throw new Error('Failed to fetch user data: ' + error.message);
      });
  }
  
};

export default propertyService;
