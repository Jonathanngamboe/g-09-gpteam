<template>
  <div v-if="room">
    <q-card flat>
      <!-- Tabs -->
      <q-tabs mobile-arrows v-model="tab" dense align="justify" >
        <q-tab name="one" icon="info" />
        <q-tab name="two" icon="edit_calendar" />
        <q-tab name="three" icon="history" alert="primary" />
      </q-tabs>

      <!-- Tab content -->
      <q-tab-panels v-model="tab" animated>

        <!-- Edit Room -->
        <q-tab-panel name="one">
          <!-- Section title -->
          <q-toolbar class="q-my-md full-width">
            <q-btn
                flat
                round
                dense
                icon="arrow_back"
                @click="goBack"
            />
            <q-toolbar-title>
              Room details
            </q-toolbar-title>
          </q-toolbar>
          <!-- Section content -->
          <q-card-section>
            <EditRoom :room="room" />
          </q-card-section>
        </q-tab-panel>

        <!-- Calendar -->
        <q-tab-panel name="two">
          <!-- Section title -->
          <q-toolbar class="q-my-md full-width">
            <q-btn
                flat
                round
                dense
                icon="arrow_back"
                @click="goBack"
            />
            <q-toolbar-title>
              Room calendar
            </q-toolbar-title>
          </q-toolbar>
          <!-- Section content -->
          <q-card-section>
            <EditAvailabilities :room="room" />
          </q-card-section>
        </q-tab-panel>

        <!-- Booking history -->
        <q-tab-panel name="three">
          <!-- Section title -->
          <q-toolbar class="q-my-md full-width">
            <q-btn
                flat
                round
                dense
                icon="arrow_back"
                @click="goBack"
            />
            <q-toolbar-title>
              Room booking history
            </q-toolbar-title>
          </q-toolbar>
          <!-- Section content -->
          <q-card-section>
            <bookingHistory :room="room" />
          </q-card-section>
        </q-tab-panel>

      </q-tab-panels>
    </q-card>
  </div>
  <div v-else>
    <div class="text-h6 text-center q-pa-md">Loading...</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RoomCardDetail from '@/components/RoomCardDetail.vue';
import propertyService from '../services/propertyService';
import EditRoom from '@/components/EditRoom.vue';
import EditAvailabilities from '../components/EditAvailabilities.vue';
import bookingHistory from '../components/booking-history.vue';
import authService from '@/services/authService';

export default {
  components: {
    RoomCardDetail,
    EditRoom,
    EditAvailabilities,
    bookingHistory,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const room = ref(null);
    const user = ref(null)

    onMounted(async () => {
      try {
        await authService.getUser();

        if (!authService.user.value) {
          router.push('/');
        }
        user.value = authService.user.value;

      } catch (error) {
        router.push('/'); 
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

    onMounted(async () => {
      const roomId = route.query.roomId;
      room.value = await propertyService.getPropertyById(roomId);    
    });


    return {
      room,
      user,
      tab: ref('one'),
      goBack,
    };
  }
};
</script>
