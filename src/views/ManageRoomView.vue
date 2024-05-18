<template>
  <div v-if="room">
    <q-card flat>
      <!-- Tabs -->
      <q-tabs mobile-arrows v-model="tab" dense align="justify" >
        <q-tab name="one" icon="info" />
        <q-tab name="two" icon="calendar_today" />
        <q-tab name="three" icon="history" alert="primary" />
      </q-tabs>
      <!-- Tab content -->
      <q-tab-panels v-model="tab" animated>
        <!-- Room details -->
        <q-tab-panel name="one">
          <q-toolbar class="q-mb-md full-width">
            <q-toolbar-title>
              Room Details
            </q-toolbar-title>
          </q-toolbar>
          <q-card-section>
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
            <!-- Room details -->
            <div class="text-overline text-secondary q-pt-md">{{ room.city.name }}</div>
            <div class="text-h5 q-mt-sm q-mb-xs">{{ room.title }}</div>
            <div class="text-subtitle1 q-mb-xs">{{ formatNumber(room.surface) }} m²</div>
            <div class="text-h7 text-dark q-mb-xs">CHF {{ formatNumber(room.price_per_night) }}.- per night</div>
            <div class="text-caption text-grey">{{ formatAmenities(room.amenities) }}</div>
            <div class="text-subtitle2 q-mt-md">{{ room.description }}</div>
          </q-card-section>
        </q-tab-panel>
        <!-- Calendar -->
        <q-tab-panel name="two">
          <q-card-section>
            <q-toolbar class="q-mb-md full-width">
            <q-toolbar-title>
              Availibilities
            </q-toolbar-title>
          </q-toolbar>
          </q-card-section>
        </q-tab-panel>
        <!-- Booking history -->
        <q-tab-panel name="three">
          <q-card-section>
            <q-toolbar class="q-mb-md full-width">
            <q-toolbar-title>
              Booking History
            </q-toolbar-title>
          </q-toolbar>
          </q-card-section>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
  <div v-else>
    <div class="text-h6 text-center q-pa-md">Loading...</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import RoomCardDetail from '@/components/RoomCardDetail.vue';
import propertyService from '../services/propertyService';

export default {
  components: {
    RoomCardDetail
  },
  setup() {
    const route = useRoute();
    const room = ref(null);

    onMounted(async () => {
      const roomId = route.query.roomId;
      room.value = await propertyService.getPropertyById(roomId);    
    });

    function formatNumber(number) {
        if(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
        return 0;
    }

    function formatAmenities(amenities) {
        return amenities.map(amenity => amenity.name).join(' · ');
    }

    return {
      room,
      tab: ref('one'),
      slide: ref(0),
      fullscreen: ref(false),
      formatNumber,
      formatAmenities
    };
  }
};
</script>
