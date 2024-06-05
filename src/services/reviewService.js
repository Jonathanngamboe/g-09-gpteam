import api from "./api";

const endpoint = "/reviews/";

export default {
    getAllReviews() {
        return api.get(endpoint)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error("Failed to fetch reviews: " + error.message);
        });
    },
    
    getReviewById(id) {
        return api.get(`${endpoint}/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error(`Failed to fetch review with ID ${id}: ` + error.message);
        });
    },
    
    createReview(reviewData) {
        return api.post(endpoint, reviewData)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error("Failed to create review: " + error.response.data[0]);
        });
    },
    
    updateReview(id, reviewData) {
        return api.put(`${endpoint}/${id}`, reviewData)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error(`Failed to update review with ID ${id}: ` + error.message);
        });
    },
    
    deleteReview(id) {
        return api.delete(`${endpoint}/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error(`Failed to delete review with ID ${id}: ` + error.message);
        });
    },

    getReviewsByBooking(bookingId) {
        return api.get(`/reviews/booking/${bookingId}`)
            .then(response => response.data)
            .catch(error => {
                    throw new Error("Failed to fetch reviews for the booking: " + error.message);
                });
    },
    
    getReviewsByUser(userId) {
        return api.get(`/reviews/user/${userId}/guest`)
            .then(response => response.data)
            .catch(error => {
                    throw new Error("Failed to fetch reviews for the user: " + error.message);
                });
    },

};