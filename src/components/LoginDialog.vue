<template>
  <q-dialog v-model="visible" :position="Position">
    <div class="form-dimension">
      <img alt="Vue logo" src="../assets/logo-vue.png" class="modal-logo" />
      <input type="text" v-model="username" placeholder="username" style="margin-bottom: 5%;" />
      <input type="password" v-model="password" placeholder="password" style="margin-bottom: 5%;" />
      <div class="button-group">
        <q-btn style="width: 130px" unelevated rounded color="green-14" label="Login" @click="login"/>
        <q-btn style="width: 130px" unelevated rounded color="green-14" label="Register" @click="register"/>
        <!----<input type="submit" value="Login" @click="login"  />
        <input type="submit" value="Register" @click="register" />-->
      </div>
    </div>
  
  </q-dialog>


</template>
<script>
import { defineComponent, ref, reactive, computed } from 'vue';
import authService from '@/services/authService';  
import { useQuasar } from 'quasar'; 
  
export default defineComponent({
  emits: ['toggle-login', 'update:isVisible'],

  props: {
    isVisible: Boolean
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    //const dialogPosition = computed(() => $q.screen.lt.md ? 'bottom' : 'standard');
    const Position = computed(() => {
      return $q.screen.lt.md ? 'bottom' : 'standard';
    });

    const visible = computed({
      get: () => props.isVisible,
      set: (val) => emit('update:isVisible', val)
    });
    const username = ref('');
    const password = ref('');
    const loginError = ref('');

    
    const login = async () => {
      loginError.value = "";
      try {
        await authService.login({
          username: username.value,
          password: password.value
        });
      } catch (err) {
        loginError.value = err.response.data;
      }
    };

   
    const logout = async () => {
      await authService.logout();
    };

    
    const register = async () => {
      loginError.value = "";
      try {
        await authService.register({
          username: username.value,
          password1: password.value,
          password2: password.value
        });
      } catch (err) {
        loginError.value = err.response.data;
      }
    };

    
    authService.getUser();

    return {
      
      visible,
      username,
      password,
      loginError,
      Position,
      login,
      logout,
      register
    };
  }
});

</script>
<style src="..\assets\css\Component.css"></style>