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
        <!-- Room details -->
        <q-tab-panel name="one">
          <q-toolbar class="q-mb-md full-width">
            <q-toolbar-title>
              Room Details
            </q-toolbar-title>
          </q-toolbar>
          <q-card-section>
            <!-- Edit Room -->
            <EditRoom :room="room" />
          </q-card-section>
        </q-tab-panel>
        <!-- Calendar -->
        <q-tab-panel name="two">
          <q-card-section>
            <q-toolbar class="q-mb-md full-width">
            <q-toolbar-title>
              Availibilities
            </q-toolbar-title>
          </q-toolbar>
          </q-card-section>
        </q-tab-panel>
        <!-- Booking history -->
        <q-tab-panel name="three">
          <q-card-section>
            <q-toolbar class="q-mb-md full-width">
            <q-toolbar-title>
              Booking History
            </q-toolbar-title>
          </q-toolbar>
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
import { useRoute } from 'vue-router';
import RoomCardDetail from '@/components/RoomCardDetail.vue';
import propertyService from '../services/propertyService';
import EditRoom from '@/components/EditRoom.vue';

export default {
  components: {
    RoomCardDetail,
    EditRoom,
  },
  setup() {
    const route = useRoute();
    const room = ref(null);

    onMounted(async () => {
      const roomId = route.query.roomId;
      room.value = await propertyService.getPropertyById(roomId);    
    });


    return {
      room,
      tab: ref('one'),
    };
  }
};
</script>
