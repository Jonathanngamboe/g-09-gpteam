<template>
    <div v-if="utilisateur">
      <UserInformation :utilisateur="utilisateur" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import authService from '@/services/authService';
  import UserInformation from "@/components/UserInformation.vue"// Assurez-vous que le chemin est correct
  
  export default {
    components: {
      UserInformation
    },
    setup() {
      const utilisateur = ref(null);
  
      onMounted(async () => {
        try {
          // Call getUser to get the user data
          await authService.getUser();
  
          // Extract the user data from the response
          utilisateur.value = authService.user.value;
        } catch (error) {
          console.error('An error occurred:', error);
        }
      });
  
      return { utilisateur };
    }
  }
  </script>