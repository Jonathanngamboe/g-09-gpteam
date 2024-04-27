<template>
    <q-card flat bordered>
      <!-- Room image -->
      <q-img :src="room.images[0]" />
  
      <!-- Card content -->
      <q-card-section>
        <div class="text-overline text-secondary">{{ room.location }}</div>
        <q-rating readonly color="black" v-model="room.rating" :max="5" size="16px" />
        <div class="text-h5 q-mt-sm q-mb-xs">{{ room.title }}</div>
        <div class="text-subtitle1 q-mb-xs">{{ formatNumber(room.surfaceArea) }} m²</div>
        <div class="text-h7 text-dark q-mb-xs">CHF {{ formatNumber(room.price) }}.- per night</div>
        <div class="text-caption text-grey">
          {{ formatAmenities(room.amenities) }}
        </div>
      </q-card-section>
  
      <!-- Card actions -->
      <q-card-actions>
        <!-- TODO : Implement favorite functionality -->
        <q-btn flat round color="red" icon="favorite" />
        <q-btn flat round color="primary" icon="share" @click="shareRoom"/>
        <q-btn style="width: 130px" unelevated rounded color="primary" label="Details" @click="$emit('room-details', room.id)"/>
      </q-card-actions>
    </q-card>
</template>

<script>
  import { useQuasar } from 'quasar';

  export default {
    setup(props) {
      const $q = useQuasar();

    const shareRoom = () => {
      if (navigator.share) {
        navigator
          .share({
            title: `${props.room.title}`,
            text: `Check out this room: ${props.room.title}, located at ${props.room.location}. Details: ${props.room.description}`,
            url: `${window.location.origin}/room/${props.room.id}`
          })
          .then(() => {
            $q.notify({
              message: "Thanks for sharing!",
              color: "green-14",
              position: "top",
              icon: "thumb_up"
            })
          })
          .catch((error) => {
            $q.notify({
              message: 'Failed to share. Please try again.',
              color: 'red-14',
              position: 'top',
              icon: 'error' 
            });
          });
        } else {
          $q.notify({
            message: 'Sharing is not supported on this device',
            color: 'orange-14',
            position: 'top',
            icon: 'warning' 
          });
        }
      };

      return { shareRoom };
    },
    props: {
      room: Object
    },
    methods: {
      // Helper function to format amenities
      formatAmenities(amenities) {
        const maxVisibleAmenities = 3;
        const visibleAmenities = amenities.slice(0, maxVisibleAmenities).join(' · ');
        return amenities.length > maxVisibleAmenities
          ? `·${visibleAmenities} and ${amenities.length - maxVisibleAmenities} more`
          : visibleAmenities;
      },
      formatNumber(number) {
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
    }
  }
</script>

<style scoped>
    .q-card {
      width: 100%; /* Make sure the card stretches to fill the grid item */
      display: flex; /* Use flex layout for the card itself */
      flex-direction: column; /* Arrange card contents vertically */
    }

    .q-card-section {
      flex: 1; /* Allow card section to expand to fill available space */
    }

    .q-img {
      height: auto; /* Set image height to auto to maintain aspect ratio */
      max-height: 200px; /* Set a max height for images */
      width: 100%; /* Set image width to fill card width */
      object-fit: cover; /* Cover ensures the image covers the area, might crop */
    }  
</style>
