<template>
    <q-card flat bordered>
      <!-- Room image -->
      <q-img :src="room.image" />
  
      <!-- Card content -->
      <q-card-section>
        <div class="text-overline text-secondary">{{ room.location }}</div>
        <q-rating v-model="room.rating" :max="5" size="16px" />
        <div class="text-h5 q-mt-sm q-mb-xs">{{ room.title }}</div>
        <div class="text-subtitle1 q-mb-xs">{{ room.surfaceArea }} m²</div>
        <div class="text-h7 text-dark q-mb-xs">From CHF {{ room.price }}.-</div>
        <div class="text-caption text-grey">
          {{ formatAmenities(room.amenities) }}
        </div>
      </q-card-section>
  
      <!-- Card actions -->
      <q-card-actions>
        <q-btn flat round color="red" icon="favorite" />
        <q-btn flat round color="primary" icon="share" />
        <q-btn color="primary" label="Book" />
        
        <q-space />
  
        <!-- Toggling the detailed view for each card -->
        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="room.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="toggleExpanded"
        />
      </q-card-actions>
  
      <!-- Slide transition for detailed view -->
      <q-slide-transition>
        <div v-show="room.expanded">
          <q-separator />
          <q-card-section class="text-subtitle2">
            {{ truncateText(room.description, 100) }} 
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
</template>
  
<script>
  export default {
    props: {
      room: Object
    },
    methods: {
      toggleExpanded() {
        this.$emit('toggle-expanded', this.room.id);
      },
      // Helper function to format amenities
      formatAmenities(amenities) {
        const maxVisibleAmenities = 3;
        const visibleAmenities = amenities.slice(0, maxVisibleAmenities).join(' · ');
        return amenities.length > maxVisibleAmenities
          ? `·${visibleAmenities} and ${amenities.length - maxVisibleAmenities} more`
          : visibleAmenities;
      },
      // Helper function to truncate text and add ellipsis
      truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
  