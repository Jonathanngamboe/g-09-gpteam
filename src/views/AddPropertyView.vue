<template>
    <div class="title">
        <h2>Add a new room</h2>
    </div>
    <div class="form formdimension">
        <q-form @submit="submitForm">
            <div class="text-grey">
                <label for="title">Room Name</label>
                <q-input id="title" v-model="property.title" flat dense required />
            </div>
            <div class="text-grey">
                <label for="description">Description</label>
                <q-input id="description" v-model="property.description" type="textarea" rows="1" flat dense required
                    style="margin-bottom: 2%;" />
            </div>
            <div class="text-grey">
                <label for="price_per_night">Price per Night</label>
                <q-input id="price_per_night" v-model="property.price_per_night" flat dense required />
            </div>
            <div class="text-grey">
                <label for="address">Address</label>
                <q-input id="address" v-model="property.address" flat dense required />
            </div>
            <div class="text-grey">
                <label for="city">City</label>
                <q-select id="city" v-model="property.city" :options="cities" flat dense required
                  style="margin-bottom: 2%;" />
            </div>
           <!-- <div class="text-grey">
                <label for="zip">Zip code</label>
                <q-input id="zip" v-model="property.zip" flat dense required />
            </div>-->
            <div class="text-grey">
                <label for="surface">Surface (sqm)</label>
                <q-input id="surface" v-model="property.surface" flat dense required />
            </div>
            <div class="text-grey">
                <label for="property_type">Property Type</label>
                <q-select id="property_type" v-model="property.property_Type" :options="propertyTypes" flat dense
                    required style="margin-bottom: 2%;" />
            </div>

            <div>
                <p>Select room amenities</p>
                <q-list style="display: flex; flex-wrap: wrap;">
                    <q-item v-for="option in amenitiesOptions" :key="option.value" style="width: 50%;">
                        <q-checkbox :label="option.label" :val="option.value" v-model="property.amenities">
                        </q-checkbox>
                    </q-item>
                </q-list>
            </div>
            <div class="text-grey">
                <label for="images">Images</label>
                <q-select id="images" v-model="property.images" :options="imageOptions" multiple outlined dense style="margin-bottom: 2%;" />
            </div>
            
            <label for="upload-image" class="text-grey">Upload an image</label>
            <upload-image @image-uploaded="loadImages" />

            <div class="row justify-center">
                <q-btn type="submit" style="width: 130px" unelevated rounded color="primary" label="Add Room"
                    :disable="!isFormValid" />
                <!-- <q-toggle v-model="property.is_active" label="Is Active?" /> -->
            </div>
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
import uploadImage from "./UploadImage.vue";
import { useQuasar } from 'quasar';

export default {
    name: 'AddPropertyView',
    components: {
        uploadImage,
    },
    setup() {
        const $q = useQuasar();
        const property = ref({
            title: '',
            description: '',
            address: '',
            city: null,
            
            zip: '',
            price_per_night: 0.0, // Inizializzato come numero
            surface: null,
            property_Type: null,
            amenities: [],
            images: [],
            is_active: true
        });

        const propertyTypes = ref([]);
        const imageOptions = ref([]);
        const amenitiesOptions = ref([]);
        const cities = ref([]);

        const isFormValid = computed(() => {
            return property.value.title && property.value.price_per_night && property.value.images.length > 0;
        });

        const loadPropertyTypes = async () => {
            try {
                const types = await propertyTypesService.getAllPropertyTypes();
                propertyTypes.value = types.map(t => ({ label: t.name, value: t }));  
            } catch (error) {
                $q.notify({
                    message: 'Failed to load property types',
                    color: 'red-14',
                    position: 'top',
                    icon: 'error'
                });
            }
        };

        const loadImages = async () => {
            try {
                const images = await imagesService.getAllImages();
                imageOptions.value = images.map(i => ({ label: i.url, value: i }));
            } catch (error) {
                console.error('Failed to load images:', error);
            }
        };

        const loadAmenities = async () => {
            try {
                const amenities = await amenitiesService.getAllAmenities();
                amenitiesOptions.value = amenities.map(a => ({ label: a.name, value: a.name }));  
            } catch (error) {
                $q.notify({
                    message: 'Failed to load amenities',
                    color: 'red-14',
                    position: 'top',
                    icon: 'error'
                });
            }
        };

        const loadCities = async () => {
            try {
                const allCities = await citiesService.getAllCities();
                cities.value = allCities.map(c => ({ label: c.name, value: c }));
            } catch (error) {
                $q.notify({
                    message: 'Failed to load cities',
                    color: 'red-14',
                    position: 'top',
                    icon: 'error'
                });
            }
        };
        const addImageToOptions = (newImage) => {
            imageOptions.value.push({ label: newImage.ext_url || newImage.image_url, value: newImage.id });
            property.value.images.push(newImage.id);
        };
       

        /*const updateZipCode = (city) => {
            if (city && city.value) {
                property.value.zip = city.value.zip;
            }
        };*/

        onMounted(() => {
            loadAmenities();
            loadImages();
            loadPropertyTypes();
            loadCities();
        });

        const submitForm = async () => {
            if (isFormValid.value) {
                try {
                    const user = await authService.getCustomuser();
                    property.value.owner = user.url;
                    

                    const propertyData = {
                        ...property.value,
                        city: property.value.city.value,
                        city_id: property.value.city.value.name, 
                        property_Type: property.value.property_Type.value,  
                        price_per_night: parseFloat(property.value.price_per_night).toFixed(2),  
                        images: property.value.images.map(img => img.value), 
                        images_ids: property.value.images.map(img => img.value.id),
                        bookings: [],
                        unavailabilities: [],
                        amenities_ids: property.value.amenities.map(amenity => amenity)
                        
                         
                    };
                    
                    console.log('Property data to be sent:', propertyData);  

                    const response = await propertyService.addProperty(propertyData);
                    if (response) {
                        $q.notify({
                            message: 'Property added successfully',
                            color: 'green-14',
                            position: 'top',
                            icon: 'thumb_up'
                        });
                    }
                } catch (error) {
                    $q.notify({
                        message: `Failed to add property: ${error.message}`,
                        color: 'red-14',
                        position: 'top',
                        icon: 'error'
                    });
                    console.error('Error adding property:', error);
                }
            }
        };

        return {
            property,
            submitForm,
            isFormValid,
            propertyTypes,
            amenitiesOptions,
            imageOptions,
            cities,
            loadImages,
            addImageToOptions,
            //updateZipCode
            //updateCity,
        };
    }
};
</script>

<style src="@/assets/css/View.css"></style>
