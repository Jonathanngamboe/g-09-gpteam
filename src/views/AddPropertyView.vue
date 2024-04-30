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
            <q-input v-model="property.zip" label="Zip code" outlined dense required />
            <q-input v-model="property.surface" label="Surface (sqm)" outlined dense required />
            <q-select v-model="property.property_Type" :options="propertyTypes" label="Property Type" outlined dense
                required style="margin-bottom: 2%;" />
            <q-select v-model="property.amenities" :options="amenitiesOptions" label="Amenities" multiple outlined dense
                required style="margin-bottom: 2%;" />
            <q-select v-model="property.images" :options="imageOptions" label="Images" multiple outlined dense required
                style="margin-bottom: 2%;" />
            <q-btn type="submit" style="width: 130px" unelevated rounded color="primary" label="Add Room"
                :disable="!isFormValid" />
            <q-toggle v-model="property.is_active" label="Is Active?" />
        </q-form>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import propertyService from "@/services/propertyService";
import authService from "@/services/authService";
import amenitiesService from "@/services/amenitiesService";
import imagesService from "@/services/imagesService";
import propertyTypesService from "@/services/propertyTypesService";
import citiesService from "@/services/citiesService";

export default {
    name: 'AddPropertyView',
    setup() {
        const property = ref({
            title: '',
            description: '',
            address: '',
            city: null,
            zip: '',
            price_per_night: null,
            surface: null,
            property_Type: null,
            amenities: [],
            images: [],
            is_active: true
        });

        const propertyTypes = ref([]);
        const imageOptions = ref([]);
        const amenitiesOptions = ref([]);


        const isFormValid = computed(() => {
            return property.value.title && property.value.price_per_night && property.value.amenities.length > 0 && property.value.images.length > 0;
        });



        const loadPropertyTypes = async () => {
            try {
                const types = await propertyTypesService.getAllPropertyTypes();
                propertyTypes.value = types.map(t => ({ label: t.name, value: t.id }));
            } catch (error) {
                console.error('Failed to load property types:', error);
            }
        };

        const loadImages = async () => {
            try {
                const images = await imagesService.getAllImages();
                imageOptions.value = images.map(i => ({ label: i.image, value: i.id }));
            } catch (error) {
                console.error('Failed to load images:', error);
            }
        };

        const loadAmenities = async () => {
            try {
                const amenities = await amenitiesService.getAllAmenities();
                amenitiesOptions.value = amenities.map(a => ({ label: a.name, value: a.id }));
            } catch (error) {
                console.error('Failed to load amenities:', error);
            }
        };

        onMounted(() => {
            loadAmenities();
            loadImages();
            loadPropertyTypes();

        });


        const submitForm = async () => {
            if (isFormValid.value) {
                try {
                    const user = await authService.getCustomuser();

                    console.log('user:', user);
                    property.value.owner = user.url;
                    console.log('user:', user.url);
                    console.log('Submitting property:', property.value);
                    console.log('city:', property.value.city);
                    /*let cityId = await ensureCityExists(property.value.city);
                    const cityData = await citiesService.createCity(property.value.city, property.value.zip );
                    console.log('cityData:', cityData);
                    const cityId = cityData.id;
                    property.value.city = cityId;*/
                    
                    const response = await propertyService.addProperty(property.value);
                    console.log('Property added successfully:', response);
                } catch (error) {
                    console.error('Error adding property:', error);
                }
            }
        };

       /* async function ensureCityExists(cityName) {
            try {

                const existingCity = await citiesService.getCityByName(cityName);
                if (existingCity) {
                    return existingCity.id;
                } else {

                    const newCity = await citiesService.createCity({ name: cityName });
                    return newCity.id;
                }
            } catch (error) {
                console.error('Error handling city:', error);
                throw error;
            }
        };*/

        return {
            property,
            submitForm,
            isFormValid,
            propertyTypes,
            amenitiesOptions,
            imageOptions,

        };
    }
};
</script>

<style src="@/assets/css/View.css"></style>