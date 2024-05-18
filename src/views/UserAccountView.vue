<template>
  <q-tabs dense align="justify" v-model="tab" mobile-arrows>
    <q-tab name="user-info" icon="person" />
    <q-tab name="rooms" icon="bed" />
    <q-tab name="Messages" icon="message">
      <q-badge color="primary" floating>5</q-badge>
    </q-tab>
    <!-- Booking history tab -->
    <q-tab name="Booking History" icon="history" />
  </q-tabs>
  <!-- Page content for each tab -->
  <q-tab-panels v-model="tab" animated>
    <!-- User Information Tab Panel -->
    <q-tab-panel name="user-info">
      <UserInformation :user="user" />
    </q-tab-panel>
    <!-- Rooms Tab Panel -->
    <q-tab-panel name="rooms">
      <MyRooms :rooms="rooms" />
    </q-tab-panel>
    <!-- Messages Tab Panel -->
    <q-tab-panel name="Messages">
      <div class="q-pa-lg text-center">
        <p>Messages will be displayed here.</p>
      </div>
    </q-tab-panel>
    <!-- Booking History Tab Panel -->
    <q-tab-panel name="Booking History">
      <bookingHistory :user="user" />
    </q-tab-panel>
  </q-tab-panels>
</template>


<script>
import { ref, onMounted } from 'vue';
import authService from '@/services/authService';
import UserInformation from "@/components/UserInformation.vue";
import MyRooms from "@/components/MyRooms.vue";
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import propertyService from '@/services/propertyService';
import bookingHistory from '../components/booking-history.vue';

export default {
  components: {
    UserInformation,
    MyRooms,
    bookingHistory
  },
  setup() {
    const router = useRouter();
    const user = ref(null);
    const rooms = ref([]); 
    const $q = useQuasar();
    const splitterModel = ref(40);
    const tab = ref('user-info');

    const fetchUserProperties = async () => {
  try {
    // Fonction hypothétique pour récupérer l'ID de l'utilisateur connecté
    const userProperties = await propertyService.getUserProperties(user.value.pk); 
    rooms.value = userProperties; // Faire quelque chose avec les propriétés récupérées, par exemple les afficher
  } catch (error) {
    router.push('/');
    
    $q.notify({
      color: 'negative',
      position: 'top',
      message: `${error.message}`
    });
  }
};



    onMounted(async () => {
      try {
        await authService.getUser();

        if (!authService.user.value) {
          router.push('/'); // Redirigez vers la page d'accueil si l'utilisateur n'est pas connecté
        }
        user.value = authService.user.value;

        fetchUserProperties(); // Appelez la fonction

      } catch (error) {
        router.push('/'); // Redirigez en cas d'erreur ou si les données de l'utilisateur ne peuvent pas être récupérées
        $q.notify({
          color: 'negative',
          position: 'top',
          message: `${error.message}`
        });
      }
    });

    return { 
      user, 
      rooms, 
      splitterModel,
      tab,
      user
    };
  }
}
</script>