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

export function setLastIntent(intent) {
    state.lastIntent = intent;
}

export function clearLastIntent() {
    state.lastIntent = null;
}

export const getLastIntent = () => state.lastIntent;

export { state, searchCriteria };

