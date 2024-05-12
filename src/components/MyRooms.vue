<template>
  <q-page class="flex flex-center full-height q-pa-md">
    <div class="q-pa-md full-width">
      <q-toolbar class="q-gutter-md q-mb-md full-width">
        <q-toolbar-title>
          <q-icon name="home" class="q-mr-sm" v-if="$q.screen.gt.sm" />
          My Rooms
        </q-toolbar-title>
        <div class="text-center q-mt-lg">
        <q-btn unelevated rounded color="primary" icon="add" @click="addRoom" label="Add a Room" />
      </div>
      </q-toolbar>      <!-- Check if room exists and display card -->
      <div v-if="rooms.length > 0">
        <div v-for="room in rooms" :key="room.id">
        <room-card :room="room" @click="goToRoomDetails(room.id)" />
        </div>
      </div>
      <!-- Display message if no rooms are available -->
      <div v-else class="text-h6 text-center q-my-md">
        It's currently not possible to view your rooms but you can add a new room an viw it from the main page.
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
