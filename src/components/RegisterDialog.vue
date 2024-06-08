<template>
    <q-dialog v-model="visible" :position="Position">
        <div class="form-dimension">
            <q-bar class="full-width bg-white text-primary">
                <q-space />
                <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                </q-btn>        
            </q-bar>
            <img alt="Vue logo" src="https://freelogopng.com/images/all_img/1681038325chatgpt-logo-transparent.png" class="modal-logo" />
            <q-input type="text" v-model="username" placeholder="username"
                :rules="[val => !!val || 'Please enter your username']" />
            <q-input type="password" v-model="password" placeholder="password"
                :rules="[val => !!val || 'Please enter your password']" />
            <q-input type="text" v-model="first_name" placeholder="first name"
                :rules="[val => !!val || 'Please enter your first name']" />
            <q-input type="text" v-model="last_name" placeholder="last name"
                :rules="[val => !!val || 'Please enter your last name']" />
            <q-input type="date" v-model="date_of_birth" placeholder="date of birth"
                :rules="[val => !!val || 'Please enter your date of birth']" />
            <q-input type="email" v-model="email" placeholder="email"
                :rules="[val => !!val || 'Please enter your email']" />
            <!-- Error message -->
            <div v-if="loginError" class="text-negative q-my-md" style="text-align: center;">
                {{ loginError }}
            </div>
            <!-- Buttons -->
            <div class="row q-gutter-md justify-center">
                <q-btn style="width: 130px" unelevated rounded color="negative" label="Cancel" @click="visible = false" />
                <q-btn style="width: 130px" unelevated rounded color="primary" label="Register" @click="register"
                    :disable="!username || !password || !first_name || !last_name || !date_of_birth || !email" />
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
        const address = ref('');
        const city = ref(null);

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

        const register = async () => {
            loginError.value = "";
            try {
                // First registration
                const result = await authService.register({
                    username: username.value,
                    password1: password.value,
                    password2: password.value
                });

                if (result) {
                    // Second registration
                    const resultuser = await authService.registerUser({
                        date_of_birth: date_of_birth.value,
                        email: email.value,
                        first_name: first_name.value,
                        last_name: last_name.value,
                        address: '', 
                        city: null,
                        
                    });

                    if (resultuser) {
                        visible.value = false; // close the dialog
                        router.push({ name: 'My-account' }); // Go to the user's account page
                    } else {
                        loginError.value = "An error occurred. Please try again.";
                    }
                } else {
                    loginError.value = "An error occurred. Please try again.";
                }
            } catch (err) {
                handleError(err);
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
            register,
            date_of_birth,
            email,
            first_name,
            last_name,
            address,
            city
        };
    }
});
</script>

<style src="@/assets/css/Component.css"></style>
