<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo-vue.png" />
    <div>
    <button @click="showModal = true">Login / Sign Up</button>
    <modal :show.sync="showModal">
      <auth-form @close="showModal = false" />
    </modal>
  </div>
    <HelloWorld msg="Welcome to Your Vue.js App." />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import Modal from '../components/Modal.vue';
import LoginForm from '../components/LoginForm.vue';



export default {
  components: {
    HelloWorld,
    'modal': Modal,
    'auth-form': LoginForm
  
  },
  
    
  data() {
    return {
      showModal: false
    };
  }
}
</script>
