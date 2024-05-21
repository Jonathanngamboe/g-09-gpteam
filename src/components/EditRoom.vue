<template>
    <!-- Carrousel d'images -->
    <div class="col text-center q-gutter-md">
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
        <!-- Modifier les images -->
        <q-btn
            flat
            dense
            label="Modifier les images"
            icon-right="edit"
            @click="editImages"
            style="font-size: 10px;"
        />
    </div>

    <!-- Détails de la pièce -->
    <div class="q-mt-md">

<!-- Ville -->
<div class="row items-start q-gutter-y-sm q-my-md">
    <div class="col-3">
        <div class="col justify-between">
            <div class="text-grey">Ville</div>
            <q-btn flat dense label="Modifier" icon-right="edit" @click="toggleEditCity" style="font-size: 10px;" />
        </div>
    </div>
    <div class="col-8">
        <q-select
            v-if="isEditingCity"
            v-model="editableCity"
            :options="cities.map(city => ({ label: city.name, value: city.id }))"
            emit-value
            map-options
            dense
            style="min-width: 150px;"
            @blur="saveCity"
            @keyup.enter="saveCity"
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
                    <q-btn flat dense v-if="!isEditingTitle" label="Edit" icon-right="edit" @click="toggleEditTitle" style="font-size: 10px;" />
                </div>
            </div>
            <div class="col-8">
                <div v-if="!isEditingTitle" class="text-h5">{{ room.title }}</div>
                <q-input v-else v-model="editableTitle" @blur="saveTitle" @keyup.enter="saveTitle" />
            </div>
        </div>
        <q-separator/>

        <!-- Surface -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Surface</div>
                    <q-btn flat dense v-if="!isEditingSurface" label="Modifier" icon-right="edit" @click="toggleEditSurface" style="font-size: 10px;" />
                </div>
            </div>
            <div class="col-8">
                <div v-if="!isEditingSurface" class="text-subtitle1">{{ formatNumber(room.surface) }} m²</div>
                <q-input v-else v-model="editableSurface" @blur="saveSurface" @keyup.enter="saveSurface" />
            </div>
        </div>
        <q-separator/>
        
        <!-- Prix -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Prix</div>
                    <q-btn flat dense v-if="!isEditingPrice" label="Modifier" icon-right="edit" @click="toggleEditPrice" style="font-size: 10px;" />
                </div>
            </div>
            <div class="col-8">
                <div v-if="!isEditingPrice" class="text-h7 text-dark">CHF {{ formatNumber(room.price_per_night) }}.-</div>
                <q-input v-else v-model="editablePrice" @blur="savePrice" @keyup.enter="savePrice" />
            </div>
        </div>
        <q-separator/>

        <!-- Commodités -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Commodités</div>
                    <q-btn flat dense label="Modifier" icon-right="edit" @click="editAmenities" style="font-size: 10px;" />
                </div>
            </div>
            <div class="col-8">
                <div class="text-caption text-grey">{{ formatAmenities(room.amenities) }}</div>
            </div>
        </div>
        <q-separator/>
        <!-- Description -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Description</div>
                    <q-btn flat dense v-if="!isEditingDescription" label="Modifier" icon-right="edit" @click="toggleEditDescription" style="font-size: 10px;" />
                </div>
            </div>
            <div class="col-8">
                <div v-if="!isEditingDescription" class="text-subtitle2">{{ room.description }}</div>
                <q-input v-else v-model="editableDescription" @blur="saveDescription" @keyup.enter="saveDescription" />
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import propertyService from '../services/propertyService';
import citiesService from '../services/citiesService';

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
    const editableCity = ref(props.room.city.id);

    // Méthode pour récupérer toutes les villes
    const getAllCities = async () => {
      try {
        cities.value = await citiesService.getAllCities();
        console.log('Cities:', cities.value);
      } catch (error) {
        notifyError('Une erreur est survenue lors de la récupération des villes', error);
      }
    };

    // Appel de la méthode pour récupérer les villes au chargement du composant
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
    // Cloner la propriété existante
    //const updatedPropertyData = ref(null);
    //updatedPropertyData.value = JSON.parse(JSON.stringify(props.room));
    //console.log('props.room:', props.room );
    //console.log('updatedPropertyData:', updatedPropertyData);

    // Mettre à jour le champ spécifié
    //updatedPropertyData.value.title= editableField.value;
    //console.log('updatedPropertyData:', updatedPropertyData);

    // Appeler la méthode de service pour mettre à jour la propriété
    await propertyService.updateProperty(props.room.id, props.room);

    // Mettre à jour la propriété locale avec les nouvelles données
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
    } = createEditMethod('title', 'Le titre de la pièce a été mis à jour avec succès.');

    const {
      isEditing: isEditingSurface,
      editableField: editableSurface,
      toggleEdit: toggleEditSurface,
      saveField: saveSurface
    } = createEditMethod('surface', 'La surface de la pièce a été mise à jour avec succès.');

    const {
      isEditing: isEditingDescription,
      editableField: editableDescription,
      toggleEdit: toggleEditDescription,
      saveField: saveDescription
    } = createEditMethod('description', 'La description de la pièce a été mise à jour avec succès.');

    const {
      isEditing: isEditingPrice,
      editableField: editablePrice,
      toggleEdit: toggleEditPrice,
      saveField: savePrice
    } = createEditMethod('price_per_night', 'Le prix par nuit a été mis à jour avec succès.');

    const toggleEditCity = () => {
      isEditingCity.value = !isEditingCity.value;
      editableCity.value = props.room.city.id;
    };

    const saveCity = async () => {
      try {
        const city = cities.value.find(city => city.id === editableCity.value);
        const updatedPropertyData = {
          ...props.room,
          city: {
            url: city.url,
            name: city.name,
            zip: city.zip
          }
        };

        await propertyService.updateProperty(props.room.id, updatedPropertyData);
        props.room.city = city;
        notifySuccess('La ville a été mise à jour avec succès.');
        toggleEditCity();
      } catch (error) {
        notifyError('Une erreur est survenue lors de la mise à jour de la ville', error);
      }
    };

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

    const formatNumber = (number) => {
      return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : 0;
    };

    const formatAmenities = (amenities) => {
      return amenities.map(amenity => amenity.name).join(' · ');
    };

    const editAmenities = () => {
      console.log('Modifier les commodités');
    };

    const editImages = () => {
      console.log('Modifier les images');
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
      editAmenities,
      editImages
    };
  }
};
</script>