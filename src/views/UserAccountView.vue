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
            <MyRooms :room="room" />
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
          <MyRooms :room="room" />
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

export default {
  components: {
    UserInformation,
    MyRooms,
  },
  setup() {
    const router = useRouter();
    const user = ref(null);
    const room = ref(null); // Define room
    const $q = useQuasar();
    const splitterModel = ref(40);
    const tab = ref('user-info');

    onMounted(async () => {
      try {
        await authService.getUser();

        if (!authService.user.value) {
          router.push('/'); // Redirect to home page if user is not logged in
        }
        user.value = authService.user.value;

        // TODO: Fetch user's rooms

        } catch (error) {
          router.push('/'); // Redirect on error or if user data cannot be fetched
          $q.notify({
            color: 'negative',
            position: 'top',
            message: `${error.message}`
          });
        }
      });

    return { 
      user, 
      room, 
      splitterModel,
      tab
    };
  }
}
</script>