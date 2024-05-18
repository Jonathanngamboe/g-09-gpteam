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
                    <q-btn flat dense label="Modifier" icon-right="edit" @click="editCity" style="font-size: 10px;"/>
                </div>
            </div>
            <div class="col-8">
                <div class="text-overline text-secondary">{{ room.city.name }}</div>
            </div>
        </div>
        <q-separator/>

        <!-- Titre -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Titre</div>
                    <q-btn flat dense v-if="!isEditingTitle" label="Modifier" icon-right="edit" @click="toggleEditTitle" style="font-size: 10px;"/>
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
                    <q-btn flat dense v-if="!isEditingSurface" label="Modifier" icon-right="edit" @click="toggleEditSurface" style="font-size: 10px;"/>
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
                    <q-btn flat dense label="Modifier" icon-right="edit" @click="editPrice" style="font-size: 10px;"/>
                </div>
            </div>
            <div class="col-8">
                <div class="text-h7 text-dark">CHF {{ formatNumber(room.price_per_night) }}.-</div>
            </div>
        </div>
        <q-separator/>

        <!-- Commodités -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Commodités</div>
                    <q-btn flat dense label="Modifier" icon-right="edit" @click="editAmenities" style="font-size: 10px;"/>
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
                    <q-btn flat dense label="Modifier" icon-right="edit" @click="editDescription" style="font-size: 10px;"/>
                </div>
            </div>
            <div class="col-8">
                <div class="text-subtitle2">{{ room.description }}</div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, reactive } from 'vue';
import { useQuasar } from 'quasar';
import propertyService from '../services/propertyService';

export default {
    props: {
        room: Object
    },
    setup(props) {
    const $q = useQuasar();

    // Définition des données réactives
    const fullscreen = ref(false);
    const slide = ref(0);

    // Méthodes générales d'édition
    const createEditMethod = (fieldName, updateFunction, successMessage) => {
        const isEditing = ref(false);
        const editableField = ref(props.room[fieldName]);

        const toggleEdit = () => {
            isEditing.value = !isEditing.value;
            if (!isEditing.value) {
                editableField.value = props.room[fieldName]; // réinitialiser la valeur si l'édition est annulée
            }
        };

        const saveField = async () => {
            try {
                await updateFunction(props.room.id, { [fieldName]: editableField.value });
                props.room[fieldName] = editableField.value; // mettre à jour la valeur du champ avec la nouvelle valeur
                $q.notify({
                    color: 'positive',
                    position: 'top',
                    message: successMessage,
                    icon: 'check_circle'
                });
                toggleEdit();
            } catch (error) {
                $q.notify({
                    color: 'negative',
                    position: 'top',
                    message: `Une erreur est survenue lors de la mise à jour de ${fieldName} : ${error.message}`,
                    icon: 'error'
                });
            }
        };

        return {
            isEditing,
            editableField,
            toggleEdit,
            saveField,
        };
    };

    // Méthodes spécifiques d'édition pour chaque champ
    const { isEditing: isEditingTitle, editableField: editableTitle, toggleEdit: toggleEditTitle, saveField: saveTitle } = createEditMethod(
        'title',
        propertyService.updateProperty,
        'Le titre de la pièce a été mis à jour avec succès.'
    );

    const { isEditing: isEditingSurface, editableField: editableSurface, toggleEdit: toggleEditSurface, saveField: saveSurface } = createEditMethod(
        'surface',
        propertyService.updateProperty,
        'La surface de la pièce a été mise à jour avec succès.'
    );

    // Méthodes pour le formatage des données
    const formatNumber = (number) => {
        if (number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
        return 0;
    };

    const formatAmenities = (amenities) => {
        return amenities.map(amenity => amenity.name).join(' · ');
    };

    // Méthodes d'édition pour les autres champs (ville, prix, commodités, description, images)
    const editCity = () => {
        console.log('Modifier la ville');
    };

    const editPrice = () => {
        console.log('Modifier le prix');
    };

    const editAmenities = () => {
        console.log('Modifier les commodités');
    };

    const editDescription = () => {
        console.log('Modifier la description');
    };

    const editImages = () => {
        console.log('Modifier les images');
    };

    return {
        fullscreen,
        slide,
        isEditingTitle,
        editableTitle,
        toggleEditTitle,
        saveTitle,
        isEditingSurface,
        editableSurface,
        toggleEditSurface,
        saveSurface,
        formatNumber,
        formatAmenities,
        editImages,
        editCity,
        editPrice,
        editAmenities,
        editDescription,
    };
}

};
</script>
