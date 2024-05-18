<template>
    <!-- Image carousel -->
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
        <!-- Edit images -->
        <q-btn
            flat
            dense
            label="Edit images"
            icon-right="edit"
            @click="editImages"
            style="font-size: 10px;"
        />
    </div>
    
    <!-- Room details -->
    <div class="q-mt-md">

        <!-- City -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">City</div>
                    <q-btn flat dense label="Edit" icon-right="edit" @click="editCity" style="font-size: 10px;"/>
                </div>
            </div>
            <div class="col-8">
                <div class="text-overline text-secondary">{{ room.city.name }}</div>
            </div>
        </div>
        <q-separator/>

        <!-- Title -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Title</div>
                    <q-btn flat dense label="Edit" icon-right="edit" @click="editTitle" style="font-size: 10px;"/>
                </div>
            </div>
            <div class="col-8">
                <div class="text-h5">{{ room.title }}</div>
            </div>
        </div>
        <q-separator/>

        <!-- Surface -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Surface</div>
                    <q-btn flat dense label="Edit" icon-right="edit" @click="editSurface" style="font-size: 10px;"/>
                </div>
            </div>
            <div class="col-8">
                <div class="text-subtitle1">{{ formatNumber(room.surface) }} m²</div>
            </div>
        </div>
        <q-separator/>

        <!-- Price -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                    <div class="text-grey">Price</div>
                    <q-btn flat dense label="Edit" icon-right="edit" @click="editPrice" style="font-size: 10px;"/>
                </div>
            </div>
            <div class="col-8">
                <div class="text-h7 text-dark">CHF {{ formatNumber(room.price_per_night) }}.-</div>
            </div>
        </div>
        <q-separator/>

        <!-- Amenities -->
        <div class="row items-start q-gutter-y-sm q-my-md">
            <div class="col-3">
                <div class="col justify-between">
                <div class="text-grey">Amenities</div>
                <q-btn flat dense label="Edit" icon-right="edit" @click="editAmenities" style="font-size: 10px;"/>
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
                    <q-btn flat dense label="Edit" icon-right="edit" @click="editDescription" style="font-size: 10px;"/>
                </div>
            </div>
            <div class="col-8">
                <div class="text-subtitle2">{{ room.description }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    props: {
        room: Object
    },
    setup() {
        function formatNumber(number) {
            if(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            }
            return 0;
        }

        function formatAmenities(amenities) {
            return amenities.map(amenity => amenity.name).join(' · ');
        }

        const editCity = () => {
            console.log('Edit city');
        };

        const editTitle = () => {
            console.log('Edit title');
        };

        const editSurface = () => {
            console.log('Edit surface');
        };

        const editPrice = () => {
            console.log('Edit price');
        };

        const editAmenities = () => {
            console.log('Edit amenities');
        };

        const editDescription = () => {
            console.log('Edit description');
        };

        const editImages = () => {
            console.log('Edit images');
        };

        return {
            fullscreen: ref(false),
            slide: ref(0),
            formatNumber,
            formatAmenities,
            editImages,
            editCity,
            editTitle,
            editSurface,
            editPrice,
            editAmenities,
            editDescription
        };
    }
};
</script>