<template>
  <q-page class="flex flex-center full-height q-pa-md">
    <div class="q-pa-md full-width">
      <q-toolbar class="q-gutter-md q-mb-md full-width">
        <q-toolbar-title>
          My Rooms
        </q-toolbar-title>
        <q-btn unelevated rounded color="primary" icon="add" @click="addRoom" label="Add a Room" />
      </q-toolbar>      <!-- Check if room exists and display card -->
      <div v-if="rooms.length > 0">
        <div class="row">
          <div v-for="room in rooms" :key="room.id" class="col-12 col-md-4 col-xs-12 q-pa-sm">
              <room-card :room="room" @click="goToRoomDetails(room.id)" />
          </div>
        </div>
      </div>
      <!-- Display message if no rooms are available -->
      <div v-else class="text-h6 text-center q-my-md">
        There are no rooms available. Click the button above to add a room.
      </div>
    </div>
  </q-page>
</template>

<script>
import RoomCard from '@/components/RoomCard.vue'; // Adjust the path as necessary
import RoomCardDetail from './RoomCardDetail.vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    RoomCard,
  },
  props: {
    rooms: Array
  },

  created() {
    console.log("Value of 'room' prop:", this.rooms);},
  
  setup () {
    const router = useRouter();

    function goToRoomDetails(roomId) {
      router.push({ name: 'ManageRoom', query: { roomId } });
  }
    function addRoom() {
      router.push('/add-room');
    }

    return {
      goToRoomDetails,
      addRoom
    };


  }
};
</script>
