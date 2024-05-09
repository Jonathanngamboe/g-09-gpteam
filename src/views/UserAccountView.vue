<template>
    <template v-if="$q.screen.width >= 600">
      <!-- Desktop and Tablet Layout with Splitter -->
      <q-splitter v-model="splitterModel" class="full-width">
        <template v-slot:before>
          <div class="full-height q-pa-md">
            <UserInformation :user="user" />
          </div>
        </template>
        <q-separator />
        <template v-slot:after>
          <div class="full-height q-pa-md">
            <MyRooms :rooms="rooms" />
          </div>
        </template>
      </q-splitter>
    </template>
    <template v-else>
      <!-- Mobile Layout with Tabs -->
      <q-tabs aligned="justify" v-model="tab">
        <q-tab name="user-info" icon="person" />
        <q-tab name="rooms" icon="bed" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="user-info">
          <UserInformation :user="user" />
        </q-tab-panel>
        <q-tab-panel name="rooms">
          <MyRooms :rooms="rooms" />
        </q-tab-panel>
      </q-tab-panels>
    </template>
</template>


<script>
import { ref, onMounted } from 'vue';
import authService from '@/services/authService';
import UserInformation from "@/components/UserInformation.vue";
import MyRooms from "@/components/MyRooms.vue";
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import roomService from '@/services/roomService';

export default {
  components: {
    UserInformation,
    MyRooms,
  },
  setup() {
    const router = useRouter();
    const user = ref(null);
    const rooms = ref([]); // Définissez la propriété room
    const $q = useQuasar();
    const splitterModel = ref(40);
    const tab = ref('user-info');

    const fetchUserProperties = async () => {
  try {
    // Fonction hypothétique pour récupérer l'ID de l'utilisateur connecté
    console.log("User :", user);
    const userProperties = await roomService.getUserProperties(user.value.pk);
    
    console.log("User properties:", userProperties); 
    rooms.value = userProperties; // Faire quelque chose avec les propriétés récupérées, par exemple les afficher
    console.log("Value of room after assignment:", rooms.value);
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
      tab
    };
  }
}
</script>