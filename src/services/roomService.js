import api from './api'; // Assurez-vous que le chemin est correct

const endpoint = '/properties';

export default {
  getAllRooms() {
    return api.get(endpoint)
      .then(response => response.data)
      .catch(error => {
        throw new Error('Failed to fetch rooms: ' + error.message);
      });
  },

  getRoomById(id) {
    return api.get(`${endpoint}/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Failed to fetch room with ID ${id}: ` + error.message);
      });
  },

  createRoom(roomData) {
    return api.post(endpoint, roomData)
      .then(response => response.data)
      .catch(error => {
        throw new Error('Failed to create room: ' + error.message);
      });
  },

  updateRoom(id, roomData) {
    return api.put(`${endpoint}/${id}`, roomData)
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Failed to update room with ID ${id}: ` + error.message);
      });
  },

  deleteRoom(id) {
    return api.delete(`${endpoint}/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Failed to delete room with ID ${id}: ` + error.message);
      });
  },
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


