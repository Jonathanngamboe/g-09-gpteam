<template>
  <q-dialog v-model="visible" :position="Position">
    <div class="form-dimension">
      <img alt="Vue logo" src="https://freelogopng.com/images/all_img/1681038325chatgpt-logo-transparent.png" class="modal-logo" />
      <q-input type="text" v-model="username" placeholder="username" :rules="[val => !!val || 'Please enter your username']" />
      <q-input type="password" v-model="password" placeholder="password" :rules="[val => !!val || 'Please enter your password']" />
      <!-- Error message -->
      <div v-if="loginError" class="text-negative q-my-md" style="text-align: center;">
        {{ loginError }}
      </div>
      <!-- Buttons -->
      <div class="button-group">
        <q-btn style="width: 130px" unelevated rounded color="primary" label="Login" @click="login" :disable="!username || !password" />
        <q-btn style="width: 130px" unelevated rounded color="primary" label="Register" @click="openRegister" />
      </div>
    </div>
  </q-dialog>
  <RegisterDialog :isVisible="registerVisible" @update:isVisible="val => registerVisible = val" @close="registerVisible = false" />
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import authService from '@/services/authService';  
import { useQuasar } from 'quasar'; 
import { useRouter } from 'vue-router';
import RegisterDialog from './RegisterDialog.vue';

export default defineComponent({
  emits: ['toggle-login', 'update:isVisible'],
  props: {
    isVisible: Boolean
  },
  components: {
    RegisterDialog
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const router = useRouter();
    const Position = computed(() => $q.screen.lt.md ? 'bottom' : 'standard');
    const visible = computed({
      get: () => props.isVisible,
      set: (val) => emit('update:isVisible', val)
    });
    const username = ref('');
    const password = ref('');
    const loginError = ref('');
    const registerVisible = ref(false);

    const login = async () => {
      loginError.value = "";
      try {
        const result = await authService.login({
          username: username.value,
          password: password.value
        });
        if (result) {
          visible.value = false; // Close the dialog
        } else {
          loginError.value = "An error occurred. Please try again.";
        }
      } catch (err) {
        handleError(err);
      }
    };

    const handleError = (err) => {
      if (err.response) {
        const errors = err.response.data;
        for (const key in errors) {
          if (errors[key] instanceof Array) {
            loginError.value = errors[key].join(' ');
          } else {
            loginError.value = errors[key];
          }
          break;
        }
      } else {
        loginError.value = err.message;
      }
    };

    const openRegister = () => {
      visible.value = false; // Close the login dialog
      registerVisible.value = true; // Open the register dialog
    };

    authService.getUser();

    return {
      visible,
      username,
      password,
      loginError,
      Position,
      login,
      registerVisible,
      openRegister
    };
  }
});
</script>

<style src="@/assets/css/Component.css"></style>
