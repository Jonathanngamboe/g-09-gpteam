<template>
<!-- List of editable fields -->
  <q-list>
    <q-item v-for="(value, key) in userEditable" :key="key">
      <q-item-section>
        <CitySelect v-if="key === 'city'" :disable="!isEditing" v-model="userEditable.city" @update:modelValue="value => userEditable.city = value"/>
        <q-input v-else :disable="!isEditing" v-model="userEditable[key]" :label="formatLabel(key)" :type="key === 'date_of_birth' ? 'date' : key === 'email' ? 'email' : 'text'" />
      </q-item-section>
    </q-item>
  </q-list>

  <!-- Action buttons at the bottom -->
  <q-btn unelevated rounded v-if="!isEditing" color="primary" icon="edit" label="Edit" @click="toggleEdit(true)" class="full-width" />
  <template v-else>
    <q-btn unelevated rounded flat label="Cancel" @click="toggleEdit(false)" style="width: 48%;" />
    <q-btn unelevated rounded color="primary" icon="save" label="Save" @click="updateUserDetails" style="width: 48%;" />
  </template>
</template>


<script>
import { ref, onMounted, reactive } from 'vue';
import authService from '@/services/authService';
import { useQuasar } from 'quasar';
import CitySelect from '@/components/CitySelect.vue';

export default {
  components: {
    CitySelect
  },
  setup() {
    const $q = useQuasar();
    const uneditableFields = ['id', 'url', 'groups', 'date_joined', 'last_login', 'profil_image', 'properties'];
    const userEditable = reactive({
      city: { name: '', url: '' }
    });
    const user = ref(null);
    const userGroups = ref([]);
    const isEditing = ref(false);

    const getUserDetails = async () => {
      try {
        user.value = await authService.getCustomuser();
        if (user.value) {
          userGroups.value = user.value.groups || [];
          Object.entries(user.value).forEach(([key, value]) => {
            if (!uneditableFields.includes(key)) {
              if (key === 'city' && value) {
                userEditable.city.url = value; 
                userEditable.city.name = extractCityNameFromUrl(value);
              } else if (key !== 'city') { // Assurez-vous de ne pas écraser city avec null si value n'est pas définie
                userEditable[key] = value;
              }
            }
          });
          // Put city at the end of the list
          const city = userEditable.city;
          delete userEditable.city;
          userEditable.city = city;
        }
      } catch (error) {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: `An error occurred while fetching user details: ${error.message}`,
          icon: 'report_problem'
        });
      }
    };

    const updateUserDetails = async () => {
      try {
        const payload = {
          ...userEditable,
          city: userEditable.city ? userEditable.city.url : null
        };
        await authService.updateCustomuser(user.value.id, payload);
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
          message: `${error.message}`,
          icon: 'error'
        });
      }
    };

    const extractCityNameFromUrl = (url) => {
        return url?.split('/').filter(part => part).pop() || '';
    };
    

    const toggleEdit = (editMode) => {
      isEditing.value = editMode;
      if (!editMode) {
        getUserDetails(); // Reset to last saved state if cancelling
      }
    };

    const formatLabel = (key) => {
      if (key === 'date_of_birth') return 'Date of Birth';
      return key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    onMounted(getUserDetails);

    return { userEditable, updateUserDetails, toggleEdit, isEditing, formatLabel, userGroups };
  }
};
</script>
