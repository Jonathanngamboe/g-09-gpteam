<template>
  <form @submit.prevent="updateUserDetails">
    <label>
      First Name:
      <input v-model="user.first_name" type="text" />
    </label>
    <label>
      Last Name:
      <input v-model="user.last_name" type="text" />
    </label>
    <button type="submit">Update</button>
  </form>
</template>

<script>
import { ref, onMounted } from 'vue';
import authService from '@/services/authService';
import api from '@/services/api'; // Assuming you have an api service

export default {
  data() {
    return {
      user: {
        first_name: '',
        last_name: '',
        email: ''
      }
    };
  },
  methods: {
    async getUserDetails() {
      try {
        await authService.getUser();
        this.user.first_name = authService.user.value.first_name;
        this.user.last_name = authService.user.value.last_name;
        this.user.email = authService.user.value.email;
      } catch (error) {
        console.error('An error occurred:', error);
      }
    },
    async updateUserDetails() {
      if (!this.user.first_name || !this.user.last_name || !this.user.email) {
        console.error("First name, last name and email are required.");
        return;
      }

       try {
        const response = await api.patch('dj-rest-auth/user/', this.user);
        authService.user.value = response.data;
        this.user.first_name = authService.user.value.first_name;
        this.user.last_name = authService.user.value.last_name;
        this.user.email = authService.user.value.email;
       } catch (error) {
        console.error('An error occurred:', error);
      } 
    }
  },
  created() {
    this.getUserDetails();
  }
};
</script>