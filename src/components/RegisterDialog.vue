<template>
    <q-dialog v-model="visible" :position="Position">
        <div class="form-dimension">
            <img alt="Vue logo" src="../assets/logo-vue.png" class="modal-logo" />
            <q-input type="text" v-model="username" placeholder="username"
                :rules="[val => !!val || 'Please enter your username']" />
            <q-input type="password" v-model="password" placeholder="password"
                :rules="[val => !!val || 'Please enter your password']" />
                <q-input type="first_name" v-model="first_name" placeholder="first name"
                :rules="[val => !!val || 'Please enter your first name']" />
                <q-input type="last_name" v-model="last_name" placeholder="last name"
                :rules="[val => !!val || 'Please enter your last name']" />
            <q-input type="date_of_birth" v-model="date_of_birth" placeholder="date of birth"
                :rules="[val => !!val || 'Please enter your date of birth']" />
            <q-input type="email" v-model="email" placeholder="email"
                :rules="[val => !!val || 'Please enter your email']" />
            <!-- Error message -->
            <div v-if="loginError" class="text-negative q-my-md" style="text-align: center;">
                {{ loginError }}
            </div>
            <!-- Buttons -->
            <div class="button-group">
                <!--<q-btn style="width: 130px" unelevated rounded color="primary" label="Login" @click="login" :disable="!username || !password" />-->
                <q-btn style="width: 130px" unelevated rounded color="primary" label="Register" @click="register"
                    :disable="!username || !password" />
                <!----<input type="submit" value="Login" @click="login"  />
          <input type="submit" value="Register" @click="register" />-->
            </div>
        </div>

    </q-dialog>


</template>
<script>
import { defineComponent, ref, computed } from 'vue';
import authService from '@/services/authService';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

export default defineComponent({
    emits: ['toggle-login', 'update:isVisible'],

    props: {
        isVisible: Boolean
    },
    setup(props, { emit }) {
        const $q = useQuasar();
        const router = useRouter();
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
        const date_of_birth = ref('');
        const email = ref('');
        const first_name = ref('');
        const last_name = ref('');


        const login = async () => {
            loginError.value = "";
            try {
                const result = await authService.login({
                    username: username.value,
                    password: password.value
                });
                if (result) {
                    visible.value = false; // Close the dialog
                    router.push({ name: 'My-account' });  // Go to the user's account page
                } else {
                    loginError.value = "An error occurred. Please try again.";
                }
            } catch (err) {
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
            }
        };


        const logout = async () => {
            await authService.logout();
        };


        const register = async () => {
            loginError.value = "";
            try {
                const result = await authService.register({
                    username: username.value,
                    password1: password.value,
                    password2: password.value,
                    date_of_birth: date_of_birth.value,
                    email: email.value,
                    first_name: first_name.value,
                    last_name: last_name.value
                });
                if (result) {
                    visible.value = false; // Close the dialog
                    router.push({ name: 'My-account' });  // Go to the user's account page
                } else {
                    loginError.value = "An error occurred. Please try again.";
                }
            } catch (err) {
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
            register,
            date_of_birth,
            email,
            first_name,
            last_name
        };
    }
});

</script>
<style src="@/assets/css/Component.css"></style>