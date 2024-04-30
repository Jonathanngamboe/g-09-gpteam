<template>

    <div class="title">
        <h2>Adding a room for rent</h2>
    </div>
    <div class="form formdimension">
        <q-form @submit="submitForm">
            <q-input v-model="property.title" label="Room Name" outlined dense required />
            <q-input v-model="property.description" label="Description" type="textarea" rows="5" outlined dense required
                style="margin-bottom: 2%;" />
            <q-input v-model="property.price_per_night" label="Price per Night" outlined dense required />
            <q-input v-model="property.address" label="Address" outlined dense required />
            <q-input v-model="property.city" label="City" outlined dense required />
            <q-input v-model="property.surface" label="Surface (sqm)" outlined dense required />
            <q-input v-model="property.image" label="Image URL" outlined dense required />
            <q-btn type="submit" style="width: 130px" unelevated rounded color="primary" label="Add Room" @click=""
                :disable="!isFormValid" />
            <q-toggle v-model="property.is_active" label="Is Active?" />
        </q-form>
    </div>
</template>

<script>
import { ref , computed , watch } from 'vue';
import propertyService from "@/services/propertyService";
import authService from "@/services/authService";
export default {
    name: 'AddPropertyView',
    setup() {
        // Define a reactive object to store the room data
        const property = ref({
            title: '',
            description: '',
            address: '',
            city: '',
            price_per_night: null,
            surface: null,
            is_active: true,
            //owner: '',
            image: ''
        });
        // Check if the form is valid
        const isFormValid = computed(() => {
            return property.value.title && property.value.price_per_night ;
        });
        // Function to handle form submission
      const submitForm = async () => {
        if (isFormValid.value) {
          try {
            await authService.getUser();
            const user = authService.user.value;
           
            property.value.owner = user.id;
            console.log('user:', user);
            console.log('property:', property.value.owner);
            const response = await propertyService.addProperty(property.value);
            console.log('Property added successfully:', response);
            // Reset the form or handle the success 
          } catch (error) {
            console.error('Error adding property:', error);
            // Handle the error 
          }
        }
      };
        



        return {
            property,
            submitForm,
            isFormValid
        };
    }
};
</script>

<style src="@/assets/css/View.css"></style>