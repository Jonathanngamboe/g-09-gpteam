import api from "@/services/api"
import { ref } from "vue"
import router from "@/router"
import { getLastIntent, clearLastIntent } from '@/utils/globalState';

let user = ref()

export default {
  user,
  login(payload) {
    if (!payload.username || !payload.password) {
      return Promise.reject("Username and password are required.")
    }

    return api.post(`dj-rest-auth/login/`, payload).then((response) => {
      user.value = response.data.user

      // Redirect after login based on the last intent or default to user account
      const intent = getLastIntent();
      if (intent) {
        router.push(intent);
        clearLastIntent(); // Reset last intent after redirection
      } else {
        router.push('/my-account');
      }
      return response.data.user
    })
  },
  logout() {
    return api.post(`dj-rest-auth/logout/`).then((response) => {
      user.value = undefined
      clearLastIntent();
      router.push('/');
      return response.data
    })
  },
  register(payload) {
    if (!payload.username || !payload.password1 || !payload.password2) {
      return Promise.reject("Username and password1 and password2 are required.")
    }

    return api.post(`dj-rest-auth/registration/`, payload).then((response) => {
      user.value = response.data.user
      return response.data.user
    })
  },
  // allows to relogin with saved token
  getUser() {
    return api
      .get(`dj-rest-auth/user/`)
      .then((response) => {
        user.value = response.data
      })
      .catch(() => {
        user.value = undefined
      })
  },

  getCustomuser() {
    return api.get(`/customusers/me/`) 
      .then((response) => {
        user.value = response.data;
        return user.value;
      })
      .catch((error) => {
        user.value = undefined;
      });
  }

}
