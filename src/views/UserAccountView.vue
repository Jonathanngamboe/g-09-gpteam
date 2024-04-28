<template>
  <div class="container">
    <div v-if="utilisateur" class="user-information-container">
      <UserInformation :utilisateur="utilisateur" />
    </div>
    <div v-if="room" class="MyRooms-container">
      <MyRooms :room="room" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import authService from '@/services/authService';
import UserInformation from "@/components/UserInformation.vue";
import MyRooms from "@/components/MyRooms.vue";


export default {
  components: {
    UserInformation,
    MyRooms,
  },
  setup() {
    const utilisateur = ref(null);
    const room = ref(null); // Define room

    onMounted(async () => {
      try {
        // Call getUser to get the user data
        await authService.getUser();

        // Extract the user data from the response
        utilisateur.value = authService.user.value;

        // Set room data
        room.value = { title: 'Room 1' }; // Replace this with your actual room data
      } catch (error) {
        console.error('An error occurred:', error);
      }
    });

    return { utilisateur, room };
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row; /* Make the main axis horizontal */
  height: 100vh; /* Make sure the parent container has a defined height */
  width: 100%;
  align-items: flex-start; /* Align the child containers at the top of the page */
}
.user-information-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 30vw; /* UserInformation takes up 1/4 of the viewport width */
}
.MyRooms-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 50vw; /* MyRooms takes up the remaining width of the viewport */

}
</style>