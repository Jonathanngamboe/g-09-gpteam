<template>
  <div class="col text-center q-gutter-md">
    <!-- Image carousel -->
    <q-carousel
      swipeable
      animated
      arrows
      v-model="slide"
      v-model:fullscreen="fullscreen"
      infinite
      thumbnails
    >
      <q-carousel-slide
        v-for="(image, index) in room.images"
        :key="index"
        :name="index"
        :img-src="image.image_url ? image.image_url : image.ext_url"
      >
        <!-- Delete button for each image in edit mode -->
        <q-btn
          v-if="isEditingImage"
          flat
          dense
          label="Delete"
          icon-right="delete"
          color="white"
          @click="confirmDeleteImage(image.id)"
          style="font-size: 10px; position: absolute; top: 10px; right: 10px;"
        />
      </q-carousel-slide>
      <template v-slot:control>
        <q-carousel-control
          position="bottom-right"
          :offset="[18, 18]"
        >
          <q-btn
            push round dense color="white" text-color="primary"
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="fullscreen = !fullscreen"
          />
        </q-carousel-control>
      </template>
    </q-carousel>

  <!-- Edit images -->
  <div v-if="isEditingImage">
    <q-list class="row justify-center">
        <q-item
          v-for="(image, index) in room.images"
          :key="index"
          @click="selectedImageIndex = index"
        >
          <q-item-section>
            <q-img
              :src="image.image_url ? image.image_url : image.ext_url"
              style="width: 50px; height: 50px;"
            />
          </q-item-section>
          <q-item-section>
            <!-- Delete button for each image -->
            <q-btn
              rounded
              flat
              dense
              label="Delete"
              icon-right="delete"
              @click="deleteImage(image.id)"
              style="font-size: 10px;"
            />
          </q-item-section>
        </q-item>
      </q-list>
      <!-- Upload button -->
      <q-uploader
        flat
        bordered
        color="secondary"
        style="max-width: 250px"
        label="Upload images"
        multiple
        accept=".jpg, image/*"
        :factory="uploadImage"
        @uploaded="onUpload"
        @rejected="onRejected"
        class="q-my-md q-ml-auto q-mr-auto"
      />
      <q-btn
        flat
        dense
        label="Close"
        icon-right="close"
        @click="toggleEditImages"
        style="font-size: 10px;"
      />
    </div>
    <div v-else>
      <q-btn
        flat
        dense
        label="Edit images"
        icon-right="edit"
        @click="toggleEditImages"
        style="font-size: 10px;"
      />
    </div>
  </div>

    <!-- Room details -->
    <div class="q-mt-md">

      <!-- City -->
      <div class="row items-start q-gutter-y-sm q-my-md">
          <div class="col-3">
              <div class="col justify-between">
                  <div class="text-grey">City</div>
                  <div v-if="!isEditingCity" class="col justify-between">
                    <q-btn flat dense label="Edit" icon-right="edit" @click="toggleEditCity" style="font-size: 10px;" />
                  </div>
                  <div v-else class="col justify-between">
                    <q-btn flat dense label="Cancel" icon-right="cancel" @click="toggleEditCity" style="font-size: 10px;" />
                    <q-btn flat dense label="Save" icon-right="save" @click="saveCity" style="font-size: 10px;" />
                  </div>
              </div>
          </div>
          <div class="col-8">
              <q-select
                  v-if="isEditingCity"
                  v-model="editableCity"
                  :options="cities.map(city => ({ label: city.name, value: city.url }))"
                  emit-value
                  map-options
                  dense
                  style="min-width: 150px;"
              />
              <div v-else class="text-overline text-secondary">{{ room.city.name }}</div>
          </div>
      </div>
      <q-separator/>

        <!-- Title -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Title</div>
                    <div v-if="!isEditingTitle" class="col justify-between">
                      <q-btn flat dense label="Edit" icon-right="edit" @click="toggleEditTitle" style="font-size: 10px;" />
                    </div>
                    <div v-else class="col justify-between">
                      <q-btn flat dense label="Cancel" icon-right="cancel" @click="toggleEditTitle" style="font-size: 10px;" />
                      <q-btn flat dense label="Save" icon-right="save" @click="saveTitle" style="font-size: 10px;" />
                    </div>
                </div>
            </div>
            <div class="col-8">
                <div v-if="!isEditingTitle" class="text-h5">{{ room.title }}</div>
                <q-input v-else v-model="editableTitle"/>
            </div>
        </div>
        <q-separator/>

        <!-- Surface -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Surface</div>
                    <div v-if="!isEditingSurface" class="col justify-between">
                      <q-btn flat dense v-if="!isEditingSurface" label="Edit" icon-right="edit" @click="toggleEditSurface" style="font-size: 10px;" />
                    </div>
                    <div v-else class="col justify-between">
                      <q-btn flat dense label="Cancel" icon-right="cancel" @click="toggleEditSurface" style="font-size: 10px;" />
                      <q-btn flat dense label="Save" icon-right="save" @click="saveSurface" style="font-size: 10px;" />
                    </div>
                </div>
            </div>
            <div class="col-8">
                <div v-if="!isEditingSurface" class="text-subtitle1">{{ formatNumber(room.surface) }} m²</div>
                <q-input v-else v-model="editableSurface"/>
            </div>
        </div>
        <q-separator/>
        
        <!-- Price per night -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Price per night</div>
                    <div v-if="!isEditingPrice" class="col justify-between">
                      <q-btn flat dense v-if="!isEditingPrice" label="Edit" icon-right="edit" @click="toggleEditPrice" style="font-size: 10px;" />
                    </div>
                    <div v-else class="col justify-between">
                      <q-btn flat dense label="Cancel" icon-right="cancel" @click="toggleEditPrice" style="font-size: 10px;" />
                      <q-btn flat dense label="Save" icon-right="save" @click="savePrice" style="font-size: 10px;" />
                    </div>
                </div>
            </div>
            <div class="col-8">
                <div v-if="!isEditingPrice" class="text-h7 text-dark">CHF {{ formatNumber(room.price_per_night) }}.-</div>
                <q-input v-else v-model="editablePrice"/>
            </div>
        </div>
        <q-separator/>

        <!-- Amenities -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Amenities</div>
                    <div v-if="!isEditingAmenities" class="col justify-between">
                      <q-btn flat dense label="Edit" icon-right="edit" @click="toggleEditAmenities" style="font-size: 10px;" />
                    </div>
                    <div v-else class="col justify-between">
                      <q-btn flat dense label="Cancel" icon-right="cancel" @click="toggleEditAmenities" style="font-size: 10px;" />
                      <q-btn flat dense label="Save" icon-right="save" @click="saveAmenities" style="font-size: 10px;" />
                    </div>
                </div>
            </div>
            <div class="col-8">
                <div v-if="!isEditingAmenities" class="text-caption text-grey">{{ formatAmenities(room.amenities) }}</div>
                <div v-else class="amenities-list">
                  <q-checkbox
                    class="amenity-item"
                    v-for="amenity in allAmenities" 
                    :key="amenity.url"
                    :label="amenity.name"
                    :value="amenity.name"
                    :model-value="editableAmenities.includes(amenity.name)" 
                    @update:model-value="editableAmenities = $event ? [...editableAmenities, amenity.name] : editableAmenities.filter(a => a !== amenity.name)"
                  />
                </div>
            </div>
        </div>
        <q-separator/>
        <!-- Description -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Description</div>
                    <div v-if="!isEditingDescription" class="col justify-between">
                      <q-btn flat dense v-if="!isEditingDescription" label="Edit" icon-right="edit" @click="toggleEditDescription" style="font-size: 10px;" />
                    </div>
                    <div v-else class="col justify-between">
                      <q-btn flat dense label="Cancel" icon-right="cancel" @click="toggleEditDescription" style="font-size: 10px;" />
                      <q-btn flat dense label="Save" icon-right="save" @click="saveDescription" style="font-size: 10px;" />
                    </div>
                </div>
            </div>
            <div class="col-8">
                <div v-if="!isEditingDescription" class="text-subtitle2">{{ room.description }}</div>
                <q-input type="textarea" v-else v-model="editableDescription" />
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import propertyService from '../services/propertyService';
import citiesService from '../services/citiesService';
import amenitiesService from '../services/amenitiesService';
import imagesService from '../services/imagesService';

export default {
  props: {
    room: Object
  },
  setup(props) {
    const $q = useQuasar();
    const fullscreen = ref(false);
    const slide = ref(0);
    const cities = ref([]);
    const isEditingCity = ref(false);
    const editableCity = ref(props.room.city.url);
    const isEditingAmenities = ref(false);
    const editableAmenities = ref(props.room.amenities.map(a => a.name)); 
    const allAmenities = ref([]);
    const allImages = ref([]);
    const isEditingImage = ref(false);
    const editableImage = ref(props.room.images.url);
    const selectedImageIndex = ref(0);
    const showEditImagesModal = ref(false);

    const notifySuccess = (message) => {
      $q.notify({
        color: 'positive',
        position: 'top',
        message,
        icon: 'check_circle'
      });
    };

    const notifyError = (message, error) => {
      $q.notify({
        color: 'negative',
        position: 'top',
        message: `${message} : ${error.message}`,
        icon: 'error'
      });
    };

    // Method to retrieve all cities
    const getAllCities = async () => {
      try {
        cities.value = await citiesService.getAllCities();
      } catch (error) {
        notifyError('Une erreur est survenue lors de la récupération des villes', error);
      }
    };

    const getAllAmenities = async () => {
      try {
        allAmenities.value = await amenitiesService.getAllAmenities();
      } catch (error) {
        notifyError('An error occurred while retrieving amenities', error);
      }
    };

    getAllAmenities();

    // Calling the method for retrieving cities when the component is loaded
    getAllCities();

    const createEditMethod = (fieldName, successMessage) => {
      const isEditing = ref(false);
      const editableField = ref(props.room[fieldName]);

      const toggleEdit = () => {
        isEditing.value = !isEditing.value;
        if (!isEditing.value) {
          editableField.value = props.room[fieldName];
        }
      };

      const saveField = async () => {
        try {
          // Clone existing property
          const updatedPropertyData = { [fieldName]: editableField.value };

          // Call the service method to update the property
          await propertyService.updateProperty(props.room.id, updatedPropertyData);
          props.room[fieldName] = editableField.value;

          // Display a success notification
          notifySuccess(successMessage);

          // Toggle out of editing mode
          toggleEdit();
        } catch (error) {
          // Display error notification
          notifyError(`Une erreur est survenue lors de la mise à jour de ${fieldName}`, error);
        }
      };


      return {
        isEditing,
        editableField,
        toggleEdit,
        saveField
      };
    };

    const {
      isEditing: isEditingTitle,
      editableField: editableTitle,
      toggleEdit: toggleEditTitle,
      saveField: saveTitle
    } = createEditMethod('title', 'The title has been successfully updated.');

    const {
      isEditing: isEditingSurface,
      editableField: editableSurface,
      toggleEdit: toggleEditSurface,
      saveField: saveSurface
    } = createEditMethod('surface', 'The surface has been successfully updated.');

    const {
      isEditing: isEditingDescription,
      editableField: editableDescription,
      toggleEdit: toggleEditDescription,
      saveField: saveDescription
    } = createEditMethod('description', 'The description has been successfully updated.');

    const {
      isEditing: isEditingPrice,
      editableField: editablePrice,
      toggleEdit: toggleEditPrice,
      saveField: savePrice
    } = createEditMethod('price_per_night', 'The price has been successfully updated.');

    const toggleEditCity = () => {
      isEditingCity.value = !isEditingCity.value;
      editableCity.value = props.room.city.url;
    };

    const toggleEditAmenities = () => {
      isEditingAmenities.value = !isEditingAmenities.value;
      if (!isEditingAmenities.value) {
        editableAmenities.value = props.room.amenities.map(a => a.name);
      }
    };

    const toggleEditImages = () => {
      isEditingImage.value = !isEditingImage.value;
      showEditImagesModal.value = isEditingImage.value;
      if (isEditingImage.value) {
        selectedImageIndex.value = 0;
      }
    };

  const saveImages = async () => {
    try {
      const updatedImages = { images_ids: (allImages.value.find (image => image.url === selectedImageIndex.value))};

      const response = await propertyService.updateProperty(props.room.id, { images: updatedImages });
      if (response) {
        notifySuccess('The images have been successfully updated.');

        props.room.images = allImages.value.find (image => image.url === selectedImageIndex.value);
      }
      toggleEditImages();
    } catch (error) {
      notifyError('An error occurred while updating the images', error);
    }
  }; 

  const uploadImage = async (files) => {
    if (!files || files.length === 0) {
        notifyError('No file selected');
        return;
    }

    const actualFile = files[0]; 

    const formData = new FormData();
    if (actualFile) {
        formData.append('image', actualFile);
    } else {
        notifyError('No file selected');
        return;
    }

    try {
        const response = await imagesService.uploadImageForProperty(props.room.id, formData);
        if (response) {
            propertyService.getPropertyById(props.room.id).then((property) => {
                props.room.images = property.images;
                allImages.value = property.images;
                slide.value = allImages.value.findIndex(image => image.id === response.id);
            });
            notifySuccess('Image successfully uploaded.');
        }
    } catch (error) {
        notifyError('An error occurred while uploading the image', error);
    }
  };


  const onUpload = (response) => {
    notifySuccess('Images successfully uploaded.');
  };

  const onRejected = (files) => {
      notifyError('Image upload failed', { message: `Files were rejected: ${files.map(f => f.name).join(', ')}` });
  };

    const saveCity = async () => {
      try {
        const updatedCity = { city_id: (cities.value.find(city => city.url === editableCity.value)).name };
        const response = await propertyService.updateProperty(props.room.id, updatedCity);
        if(response) {
          notifySuccess('The city has been successfully updated.');
          props.room.city = cities.value.find(city => city.url === editableCity.value);
        }
        toggleEditCity();
      } catch (error) {
        notifyError('An error occurred while updating the city', error);
      }
    };

    const formatNumber = (number) => {
      return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : 0;
    };

    const formatAmenities = (amenities) => {
      return amenities.map(amenity => amenity.name).join(' · ');
    };

    const saveAmenities = async () => {
      try {
        // Prepare the list of amenity IDs based on the selected amenity names
        const updatedAmenityIds = allAmenities.value
          .filter(amenity => editableAmenities.value.includes(amenity.name))
          .map(amenity => amenity.name); 

        const updatedPropertyData = { amenities_ids: updatedAmenityIds };
        
        // Update the property with new amenity IDs
        const response = await propertyService.updateProperty(props.room.id, updatedPropertyData);
        
        if(response) {
          // Update local state to reflect the new list of amenities
          props.room.amenities = allAmenities.value.filter(amenity => editableAmenities.value.includes(amenity.name));
          notifySuccess('Amenities have been successfully updated.');
        }
        toggleEditAmenities(); 

      } catch (error) {
        notifyError('An error occurred while updating amenities', error);
      }
    };

    const confirmDeleteImage = async (imageId) => {
      if (confirm("Are you sure you want to delete this image?")) {
        await deleteImage(imageId);
      }
    };

  const deleteImage = async (imageId) => {
    try {
      await imagesService.deleteImage(imageId);
      
      props.room.images = props.room.images.filter(image => image.id !== imageId);
      allImages.value = allImages.value.filter(image => image.id !== imageId);

      notifySuccess('Image successfully deleted.');

      const remainingImageIndex = props.room.images.findIndex(image => image.id !== imageId);
      slide.value = remainingImageIndex >= 0 ? remainingImageIndex : 0;
    } catch (error) {
      notifyError('An error occurred while deleting the image', error);
    }
  };

    return {
      fullscreen,
      slide,
      cities,
      isEditingCity,
      editableCity,
      toggleEditCity,
      saveCity,
      isEditingTitle,
      editableTitle,
      toggleEditTitle,
      saveTitle,
      isEditingSurface,
      editableSurface,
      toggleEditSurface,
      saveSurface,
      isEditingDescription,
      editableDescription,
      toggleEditDescription,
      saveDescription,
      isEditingPrice,
      editablePrice,
      toggleEditPrice,
      savePrice,
      formatNumber,
      formatAmenities,
      isEditingAmenities,
      editableAmenities,
      toggleEditAmenities,
      saveAmenities,
      getAllAmenities,
      allAmenities,
      allImages,
      isEditingImage,
      editableImage,
      toggleEditImages,
      selectedImageIndex,
      saveImages,
      deleteImage,
      confirmDeleteImage,
      showEditImagesModal,
      uploadImage,
      onUpload,
      onRejected
    };
  }
};
</script>

<style scoped>
  .amenities-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .amenity-item {
    flex: 1;
    min-width: 120px;
  }
</style>