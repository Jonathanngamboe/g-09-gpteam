<template>
  <q-tabs dense align="justify" v-model="tab" mobile-arrows inline-label no-caps>
    <q-tab name="user-info" icon="person" label="My personal details" />
    <q-tab name="rooms" icon="bed" label="My rooms" />
    <q-tab name="My rooms Bookings" icon="book" label="My rooms Bookings" />
    <!-- <q-tab name="Messages" icon="message"> 
      <q-badge color="primary" floating>5</q-badge>
    </q-tab>-->
    <q-tab name="My Booking History" icon="history" label="My Booking History" />
  </q-tabs>

  <!-- Page content for each tab -->
  <q-tab-panels v-model="tab" animated>

    <!-- User Information Tab Panel -->
    <q-tab-panel name="user-info">
      <q-toolbar class="q-gutter-md q-my-md full-width">
        <q-btn flat round dense icon="arrow_back" @click="goBack" />
        <q-toolbar-title>
          My personal details
        </q-toolbar-title>
        <div>
          <q-chip v-if="userGroups" v-for="group in userGroups" :key="group" :color="group === 'Admin' ? 'primary' : 'secondary'" style="color: white;" :label="group" class="q-my-md q-ml-md"/>
          <q-chip v-else color="secondary" label="No groups assigned" class="q-my-md q-ml-md" style="color: white;" />
        </div>
      </q-toolbar>
      <q-card-section>
        <UserInformation />
      </q-card-section>
    </q-tab-panel>

    <!-- Rooms Tab Panel -->
    <q-tab-panel name="rooms">
      <q-toolbar class="q-gutter-md q-my-md full-width">
        <q-btn
                flat
                round
                dense
                icon="arrow_back"
                @click="goBack"
            />
        <q-toolbar-title>
          My rooms
        </q-toolbar-title>
        <q-btn unelevated rounded color="primary" icon="add" @click="goToAddRoom" label="Add a Room" />
      </q-toolbar> 
      <q-card-section>
        <MyRooms :rooms="rooms" />
      </q-card-section>
    </q-tab-panel>

    <!-- Messages Tab Panel -->
    <!-- <q-tab-panel name="Messages">
      <q-toolbar class="q-gutter-md q-my-md full-width">
        <q-btn
                flat
                round
                dense
                icon="arrow_back"
                @click="goBack"
            />
        <q-toolbar-title>
          My messages
        </q-toolbar-title>
      </q-toolbar> 
    </q-tab-panel>-->

    <!-- Rooms Bookings Tab Panel -->
    <q-tab-panel name="My rooms Bookings">
      <q-toolbar class="q-gutter-md q-my-md full-width">
        <q-btn
                flat
                round
                dense
                icon="arrow_back"
                @click="goBack"
            />
        <q-toolbar-title>
          My rooms Bookings
        </q-toolbar-title>
      </q-toolbar> 
      <q-card-section>
        <bookingHistory :rooms="rooms" :user="user" />
      </q-card-section>
    </q-tab-panel>

    <!-- User Booking History Tab Panel -->
    <q-tab-panel name="My Booking History">
      <q-toolbar class="q-gutter-md q-my-md full-width">
        <q-btn
                flat
                round
                dense
                icon="arrow_back"
                @click="goBack"
            />
        <q-toolbar-title>
          My booking history
        </q-toolbar-title>
      </q-toolbar> 
      <q-card-section>
        <bookingHistory :user="user" />
      </q-card-section>
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
    const userGroups = ref([]);

    const getUserGroups = async () => {
      try {
        const customUser = await authService.getCustomuser();
        userGroups.value = customUser.groups || [];
      } catch (error) {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: `${error.message}`
        });
      }
    };

    onMounted(getUserGroups);

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

    const goBack = () => {
      router.go(-1);
    };

    function goToAddRoom() {
      router.push('/add-room');
    }

    return { 
      user, 
      rooms, 
      splitterModel,
      tab,
      user, 
      userGroups,
      goBack,
      goToAddRoom
    };
  }
}
</script>