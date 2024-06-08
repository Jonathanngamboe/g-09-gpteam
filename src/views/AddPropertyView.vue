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
                <q-input id="price_per_night" v-model="property.price_per_night" flat dense required type="number"/>
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
            <div class="text-grey">
                <label for="surface">Surface (m²)</label>
                <q-input id="surface" v-model="property.surface" flat dense required type="number"/>
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
            
            <!-- Upload button -->
            <q-uploader
                flat
                bordered
                label="Upload images"
                multiple
                accept=".jpg, image/*"
                color="secondary"
                :factory="uploadImage"
                @uploaded="onUpload"
                @rejected="onRejected"
                @removed="onRemoved"
                hide-upload-button
                auto-upload
                class="q-my-md full-width"
            />

            <div class="row justify-center">
                <q-btn type="submit" style="width: 130px" unelevated rounded color="primary" label="Add Room"
                    :disable="!isFormValid" />
            </div>
        </q-form>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import propertyService from "@/services/propertyService";
import authService from "@/services/authService";
import amenitiesService from "@/services/amenitiesService";
import propertyTypesService from "@/services/propertyTypesService";
import citiesService from "@/services/citiesService";
import { useQuasar } from 'quasar';
import citySelect from '@/components/CitySelect.vue'
import imagesService from "@/services/imagesService";

export default {
    name: 'AddPropertyView',
    components: {
        citySelect
    },
    setup() {
        const $q = useQuasar();
        const router = useRouter();
        const property = ref({
            title: '',
            description: '',
            address: '',
            city: null,
            
            zip: '',
            price_per_night: 0.0, // Initialized as number
            surface: null,
            property_Type: null,
            amenities: [],
            images: [],
            is_active: true
        });

        const propertyTypes = ref([]);
        const imagesFiles = ref([]);
        const amenitiesOptions = ref([]);
        const cities = ref([]);

        const isFormValid = computed(() => {
            return property.value.title && property.value.price_per_night > 0 && property.value.address && property.value.city && property.value.property_Type && property.value.surface > 0;
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

        const onUpload = (response) => {
            if (response) {
                $q.notify({
                    message: 'Image added successfully',
                    color: 'green-14',
                    position: 'top',
                    icon: 'thumb_up'
                });
            }
        };

        const onRejected = (files) => {
            if (files.length > 0) {
                $q.notify({
                    message: 'Image already uploaded',
                    color: 'red-14',
                    position: 'top',
                    icon: 'error'
                });
            }
        };

        const onRemoved = (filesToRemove) => {
            filesToRemove.forEach(fileToRemove => {
                imagesFiles.value = imagesFiles.value.filter(f => f.__key !== fileToRemove.__key);
            });
        };

        const uploadImage = (files) => {
            if (!files || files.length === 0) {
                $q.notify({
                    message: 'No file selected',
                    color: 'red-14',
                    position: 'top',
                    icon: 'error'
                });
                return;
            }

            files.forEach(file => {
                imagesFiles.value.push(file);  
            });
        };

        onMounted(() => {
            loadAmenities();
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
                        images_ids: [],
                        bookings: [],
                        unavailabilities: [],
                        amenities_ids: property.value.amenities.map(amenity => amenity)
                        
                         
                    };
                    
                    const response = await propertyService.addProperty(propertyData);
                    if (response) {

                        // Upload image
                        if (imagesFiles.value.length > 0) {
                            for (let file of imagesFiles.value) {
                                let individualFormData = new FormData();
                                individualFormData.append('image', file);
                                await imagesService.uploadImageForProperty(response.id, individualFormData);
                            }
                        }

                        router.push({ path: '/manage-room', query: { roomId: response.id }});
                        $q.notify({
                            message: 'Property added successfully',
                            color: 'green-14',
                            position: 'top',
                            icon: 'thumb_up'
                        });
                    }
                } catch (error) {
                    console.log(error);
                    $q.notify({
                        message: `${error}`,
                        color: 'red-14',
                        position: 'top',
                        icon: 'error'
                    });
                }
            }
        };

        return {
            property,
            submitForm,
            isFormValid,
            propertyTypes,
            amenitiesOptions,
            cities,
            onUpload,
            onRejected,
            uploadImage,
            onRemoved
        };
    }
};
</script>

<style src="@/assets/css/View.css"></style>
