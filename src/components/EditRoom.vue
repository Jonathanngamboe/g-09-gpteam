<template>
  <div class="col text-center q-gutter-md">
    <!-- Carrousel d'images -->
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
        :img-src="image.image ? image.image : image.ext_url"
      >
        <!-- Bouton de suppression pour chaque image en mode édition -->
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

    <!-- Editer les images -->
    <div v-if="!isEditingImage" class="col justify-between">
      <q-btn
        flat
        dense
        label="Edit images"
        icon-right="edit"
        @click="toggleEditImages"
        style="font-size: 10px;"
      />
    </div>
    <div v-else class="col justify-between">
      <q-btn
        flat
        dense
        label="Cancel"
        icon-right="cancel"
        @click="toggleEditImages"
        style="font-size: 10px;"
      />
      <q-btn
        flat
        dense
        label="Save"
        icon-right="save"
        @click="saveImages"
        style="font-size: 10px;"
      />
    </div>

    <!-- Formulaire de modification des images -->
    <div v-if="isEditingImage" class="q-mt-md">
      <q-carousel
        swipeable
        animated
        arrows
        v-model="selectedImageIndex"
        :options="allImages.map(image => ({ label: image.id, value: image.url }))"
        emit-value
        map-options
        dense
        infinite
        thumbnails
      >
        <q-carousel-slide
          v-for="(image, index) in allImages"
          :key="index"
          :name="index"
          :img-src="image.ext_url"
          class="carousel-slide"
        />
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
    </div>
  </div>

    <!-- Détails de la pièce -->
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
                <q-input v-else v-model="editableDescription" />
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

    // Méthode pour récupérer toutes les villes
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

    const getAllImages = async () => {
      try {
        allImages.value = await imagesService.getAllImages();
        console.log("allImages", allImages.value);
      } catch (error) {
        notifyError('An error occurred while retrieving images', error);
      }
    };

    getAllAmenities();

    // Appel de la méthode pour récupérer les villes au chargement du composant
    getAllCities();

    getAllImages();

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
          // Cloner la propriété existante
          const updatedPropertyData = { [fieldName]: editableField.value };

          // Appeler la méthode de service pour mettre à jour la propriété
          await propertyService.updateProperty(props.room.id, updatedPropertyData);
          props.room[fieldName] = editableField.value;

          // Afficher une notification de succès
          notifySuccess(successMessage);

          // Basculer hors du mode d'édition
          toggleEdit();
        } catch (error) {
          // Afficher une notification d'erreur
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
      if (isEditingImage.value) {
        selectedImageIndex.value = 0;
      }
    };

    const saveImages = async () => {
  try {
    const updatedImages = { images_ids: (allImages.value.find (image => image.url === selectedImageIndex.value))};
    console.log('updatedImages', updatedImages);
    const response = await propertyService.updateProperty(props.room.id, { images: updatedImages });
    if (response) {
      notifySuccess('The images have been successfully updated.');
      // Mettre à jour les images de la chambre avec les nouvelles images
      props.room.images = allImages.value.find (image => image.url === selectedImageIndex.value);
    }
    // Fermer le mode édition des images
    toggleEditImages();
  } catch (error) {
    notifyError('An error occurred while updating the images', error);
  }
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

    const editImages = () => {
      console.log('Edit images');
    };
    const confirmDeleteImage = async (imageId) => {
      if (confirm("Are you sure you want to delete this image?")) {
        await deleteImage(imageId);
      }
    };
// Après avoir supprimé une image, mettez à jour le modèle slide
const deleteImage = async (imageId) => {
  try {
    await imagesService.deleteImage(imageId);
    // Remove the image from the lists
    props.room.images = props.room.images.filter(image => image.id !== imageId);
    allImages.value = allImages.value.filter(image => image.id !== imageId);
    notifySuccess('Image successfully deleted.');

    // Find the index of the first remaining image
    const remainingImageIndex = props.room.images.findIndex(image => image.id !== imageId);

    // Update the slide model of the carousel to point to the index of the first remaining image
    slide.value = remainingImageIndex >= 0 ? remainingImageIndex : 0;
  } catch (error) {
    // Handle errors
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
      editImages,
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
      confirmDeleteImage
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