<template>
  <div class="modal-overlay" v-show="showModal">
    <div class="form-dimension">
      <img alt="Vue logo" src="../assets/logo-vue.png" class="modal-logo" />
      <input type="text" v-model="username" placeholder="username" style="margin-bottom: 5%;" />
      <input type="password" v-model="password" placeholder="password" style="margin-bottom: 5%;" />
      <div class="button-group">
        <input type="submit" value="Login" @click="login"  />
        <input type="submit" value="Register" @click="register" />
      </div>
    </div>
  </div>


</template>
<script>
import authService from "../services/authService";

export default {
  data() {
    return {
      showModal: true,
      username: "",
      password: "",
    }
  },
  async mounted() {
    authService.getUser()
    this.messages = await messageService.fetchMessages()
  },
  computed: {
    user() {
      return authService.user.value
    }
  },
  methods: {
    login() {
      this.loginError = ""
      authService
        .login({
          username: this.username,
          password: this.password
        })
        .catch((err) => {
          this.loginError = err.response.data
        })
    },
    logout() {
      authService.logout()
    },
    register() {
      this.loginError = ""
      authService
        .register({
          username: this.username,
          password1: this.password,
          password2: this.password
        })
        .catch((err) => {
          this.loginError = err.response.data
        })
    },
  }
}
</script>
<style src="..\assets\css\Component.css"></style>