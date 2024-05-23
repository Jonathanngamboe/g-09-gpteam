import { check } from 'prettier';
import { reactive } from 'vue';

const state = reactive({
    lastIntent: null,
});

const searchCriteria = reactive({
    destination: null,
    checkIn: null,
    checkOut: null
});

const filters = reactive({
    priceRange: { min: 1, max: 2000 },
    amenities: [],
    rating: { min: 0, max: 5 }
});

export function setFilters(priceRange, amenities, rating) {
    filters.priceRange = priceRange;
    filters.amenities = amenities;
    filters.rating = rating;
}

export function clearFilters() {
    filters.priceRange = { min: 1, max: 2000 }
    filters.amenities = [];
    filters.rating = { min: 0, max: 5 };
}

export function setSearchCriteria(destination, checkIn, checkOut) {
    searchCriteria.destination = destination;
    searchCriteria.checkIn = checkIn;
    searchCriteria.checkOut = checkOut;
}

export function clearSearchCriteria() {
    searchCriteria.destination = null;
    searchCriteria.checkIn = null;
    searchCriteria.checkOut = null;
}

export function setLastIntent(intent) {
    state.lastIntent = intent;
}

export function clearLastIntent() {
    state.lastIntent = null;
}

export const getLastIntent = () => state.lastIntent;

export { state, searchCriteria, filters };

