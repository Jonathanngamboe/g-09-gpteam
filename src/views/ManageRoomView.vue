<template>
  <div>
    <template v-if="room">
      <!-- Rendre les détails de la chambre s'ils sont disponibles -->
      <RoomCardDetail :room="room" />
    </template>
    <template v-else>
      <!-- Vous pouvez éventuellement afficher un indicateur de chargement ou un message -->
      <p>Chargement des détails de la chambre...</p>
    </template>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import RoomCardDetail from '@/components/RoomCardDetail.vue';
import roomService from '../services/roomService';

export default {
  components: {
    RoomCardDetail
  },
  setup() {
    const route = useRoute();

    // Déclaration d'une référence réactive pour stocker les détails de la chambre
    const room = ref(null);

    

    // Appeler loadRoomDetails lorsque le composant est monté
    onMounted(async () => {

      // Méthode pour charger les détails de la chambre à partir de l'API en utilisant l'ID passé en paramètre d'URL
    
       const roomId = route.query.roomId; // Récupérer l'ID de la chambre depuis les paramètres d'URL
      console.log("Room ID à récupérer:", roomId);

      // Vous pouvez ajouter votre logique pour récupérer les détails de la chambre à partir de l'API ici
      room.value = await roomService.getRoomById(roomId);
      console.log("Room details:", room.value);
    
 
});

    // Retourner les données nécessaires
    return {
      room
    };
  }
};
</script>
