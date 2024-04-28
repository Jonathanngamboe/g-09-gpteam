<template>

    <div class="title">
        <h2>Adding a room for rent</h2>
    </div>
    <div class="form formdimension">
        <q-form @submit="submitForm">
            <q-input v-model="room.name" label="Room Name" outlined dense required />
            <q-input v-model="room.description" label="Description" type="textarea"  rows="5" outlined dense required style="margin-bottom: 2%;" />
            <q-input v-model="room.price" label="Price in CHF" outlined dense required />
            <q-input v-model="room.location" label="Location" outlined dense required />
            <q-input v-model="room.image" label="Image URL" outlined dense required />
            <q-btn type="submit" style="width: 130px" unelevated rounded color="primary" label="Add Room" @click="" :disable="!room.name || !room.price || !room.location" />
            
        </q-form>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'AddRoomView',
    setup() {
        // Define a reactive object to store the room data
        const room = ref({
            name: '',
            description: '',
            price: null,
            location: '',
            image: ''
        });

        // Function to handle form submission
        const submitForm = async () => {
           
            console.log('Form submitted:', room.value);
            
            room.value = {
                name: '',
                description: '',
                price: null,
                location: '',
                image: ''
            };
        };

        return {
            room,
            submitForm
        };
    }
};
</script>

<style src="@/assets/css/View.css"></style>