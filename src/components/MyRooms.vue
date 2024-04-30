<template>
  <q-page class="flex flex-center full-height q-pa-md">
    <div class="q-pa-md full-width">
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="home" class="q-mr-sm" v-if="$q.screen.gt.sm" />
          My Rooms
        </q-toolbar-title>
      </q-toolbar>      <!-- Check if room exists and display card -->
      <div v-if="room">
        <room-card :room="room" @room-details="goToRoomDetails" />
      </div>
      <!-- Display message if no rooms are available -->
      <div v-else class="text-h6 text-center q-my-md">
        It's currently not possible to view your rooms but you can add a new room an viw it from the main page.
      </div>
      <div class="text-center q-mt-lg">
        <q-btn unelevated rounded color="primary" icon="add" @click="addRoom" label="Add a Room" />
      </div>
    </div>
  </q-page>
</template>

<script>
import RoomCard from '@/components/RoomCard.vue'; // Adjust the path as necessary

export default {
  components: {
    RoomCard
  },
  props: {
    room: Object
  },
  methods: {
    goToRoomDetails(roomId) {
      this.$router.push(`/room/${roomId}`);
    },
    addRoom() {
      this.$router.push('/add-room');
    }
  }
};
</script>
