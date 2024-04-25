<template>
    <div>
      <UserInformation v-if="utilisateur" :utilisateur="utilisateur" />
    </div>
  </template>
    
  <script>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, defineComponent, computed } from "vue"
import UserInformation from "@/components/UserInformation.vue"
  
  export default {
    components: {
      UserInformation
    },
    setup() {
      const utilisateur = ref({
        prenom: "David",
        nom: "Bürki",
        email: "d.burki@rpn.ch",
        dateDeNaissance: "1990-01-01"
      });
  
      return { utilisateur };
    }
  }
  </script>