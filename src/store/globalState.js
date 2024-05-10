import { reactive } from 'vue';

const state = reactive({
    lastIntent: null,
});

export function setLastIntent(intent) {
    state.lastIntent = intent;
}

export function clearLastIntent() {
    state.lastIntent = null;
}

export default state;
