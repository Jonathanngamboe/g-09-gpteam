<template>
  <q-page class="flex full-height column justify-center">
    <!-- Title and user group chip -->
    <div>
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="person" class="q-mr-sm" v-if="$q.screen.gt.sm" />
          Personal Details
        </q-toolbar-title>
      </q-toolbar>
      <q-chip class="q-mb-md q-ml-md" color="secondary" style="color: white;" label="Home owner" />
    </div>
    
    <!-- List of editable fields -->
    <div class="flex flex-center full-width full-height">
      <div class="q-pa-md full-width">
        <q-list>
          <q-item v-for="(value, key) in userEditable" :key="key">
            <q-item-section>
              <q-input :disable="!isEditing" v-model="userEditable[key]" :label="formatLabel(key)" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Action buttons at the bottom -->
      <div class="text-center q-pa-md full-width">
        <q-btn unelevated rounded v-if="!isEditing" color="primary" icon="edit" label="Edit" @click="toggleEdit(true)" class="full-width" />
        <template v-else>
          <q-btn unelevated rounded flat label="Cancel" @click="toggleEdit(false)" style="width: 48%;" />
          <q-btn unelevated rounded color="primary" icon="save" label="Save" @click="updateUserDetails" style="width: 48%;" />
        </template>
      </div>
    </div>
  </q-page>
</template>


<script>
import { ref, onMounted, reactive } from 'vue';
import authService from '@/services/authService';
import api from '@/services/api';
import { useQuasar } from 'quasar';

export default {
  setup() {
    const $q = useQuasar();
    const userEditable = reactive({});
    const userGroups = ref([]);
    const isEditing = ref(false);

    const getUserDetails = async () => {
      try {
        await authService.getUser();
        if (authService.user.value) {
          // Exclude the 'pk' field and populate user-editable fields
          Object.entries(authService.user.value).forEach(([key, value]) => {
            if (key !== 'pk' && key !== 'username') { // Exclude 'pk' and 'username' fields, they are not editable
              userEditable[key] = value;
            } 
          });
          userGroups.value = authService.user.value.groups || [];
        }
      } catch (error) {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'An error occurred while fetching user details.',
          icon: 'report_problem'
        });
      }
    };

    const updateUserDetails = async () => {
      try {
        const response = await api.patch('dj-rest-auth/user/', userEditable);
        Object.assign(authService.user.value, response.data);
        $q.notify({
          color: 'positive',
          position: 'top',
          message: 'User details updated successfully.',
          icon: 'check_circle'
        });
        toggleEdit(false); // Turn off editing mode after saving
      } catch (error) {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'An error occurred while updating user details.',
          icon: 'error'
        });
      }
    };

    const toggleEdit = (editMode) => {
      isEditing.value = editMode;
      if (!editMode) {
        getUserDetails(); // Reset to last saved state if cancelling
      }
    };

    const formatLabel = (key) => {
      // Improved label formatting to handle special cases
      if (key === 'date_of_birth') return 'Date of Birth';
      return key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    onMounted(getUserDetails);

    return { userEditable, updateUserDetails, toggleEdit, isEditing, formatLabel, userGroups };
  }
};
</script>
