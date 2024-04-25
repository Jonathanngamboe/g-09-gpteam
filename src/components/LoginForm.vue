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
export default {
  data() {
    return {
      showModal: true,
      username: "",
      password: "",


    }
  }
}
</script>
<style src="..\assets\css\Component.css"></style>