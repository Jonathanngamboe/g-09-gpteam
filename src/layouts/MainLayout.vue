<template>
  <q-layout view="hHh LpR fff">
    <q-header bordered class="bg-white text-primary"
      :class="`q-pl-${$q.screen.gt.sm ? 'xl' : 'xs'} q-pr-${$q.screen.gt.sm ? 'xl' : 'xs'}`">
      <q-toolbar>
        <!-- Logo -->
        <div class="row items-center"> 
          <router-link to="/">
            <img src="@/assets/logo-vue.png" alt="Logo" style="height: 30px" />
          </router-link>
        </div

        <!-- Search bar -->
        <q-toolbar-title class="row justify-center">
          <SearchBar />
        </q-toolbar-title>

        <!-- Right section with menu -->
        <div class="row items-center">
          <!-- Login dialog -->
          <LoginDialog :isVisible="loginVisible" @update:isVisible="val => loginVisible = val"
            @close="loginVisible = false" />

          <!-- Menu/Avatar icon only visible on large screens -->
          <q-btn-dropdown flat round dense icon="account_circle" v-show="$q.screen.gt.md" dropdown-icon="menu">
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <template v-for="(menuItem, index) in menuList" :key="index">
                  <!-- My account button -->
                  <div v-if="menuItem.label !== 'My account'">
                    <q-item clickable :to="menuItem.to" :active="menuItem.label === 'Outbox'" v-ripple>
                      <q-item-section avatar>
                        <q-icon :name="menuItem.icon" class="text-primary"/>
                      </q-item-section>
                      <q-item-section>
                        {{ menuItem.label }}
                      </q-item-section>
                    </q-item>
                    <q-separator :key="'sep' + index" v-if="menuItem.separator" />
                  </div>
                </template>
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center justify-center">
                <div class="column items-center" v-if="authService.user.value">
                  <q-avatar size="48px">
                    <img src="https://i.pinimg.com/736x/61/f7/5e/61f75ea9a680def2ed1c6929fe75aeee.jpg">
                  </q-avatar>

                  <div class="text-subtitle1 q-mt-md q-mb-xs">{{ authService.user.value.first_name ? authService.user.value.first_name : authService.user.value.username ? authService.user.value.username : 'User' }}</div>
                </div>
                <!-- Display the login and sign up buttons in column with a gap between them -->
                <div class="q-pa-md column items-center q-gutter-sm">
                  <q-btn
                      rounded
                      unelevated
                      color="primary"
                      label="My account"
                      size="sm"
                      v-close-popup
                      @click="toggleLogin"
                    />
                  <!-- Logout button -->
                  <q-btn
                    rounded
                    flat
                    size="sm"
                    class="text-negative"
                    label="Logout"
                    icon="logout"
                    @click="logout"
                    v-if="authService.user.value"
                  />
                </div>
              </div>
            </div>
          </q-btn-dropdown>

          <!-- Menu icon only visible on small and medium screens -->
          <q-btn flat round dense icon="menu" v-show="$q.screen.lt.lg" @click="toggleRightDrawer" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered>
      <!-- drawer content -->
      <q-scroll-area class="fit">
        <q-list class="q-ma-md">
          <template v-for="(menuItem, index) in menuList" :key="index">
            <!-- Conditional rendering based on the item label -->
            <q-item clickable v-if="menuItem.label !== 'My account'" :to="menuItem.to" :active="menuItem.label === 'Outbox'" v-ripple>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" class="text-primary" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-item clickable v-else @click="toggleLogin" v-ripple>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" class="text-primary" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
            <!-- Logout button only visible after My account -->
            <q-item clickable v-show="$q.screen.lt.lg" @click="logout" v-ripple v-if="menuItem.label === 'My account' && authService.user.value">
              <q-item-section avatar>
                <q-icon name="logout" class="text-primary" color="negative"/>
              </q-item-section>
              <q-item-section class="text-negative">
                Logout
              </q-item-section>
            </q-item>
            <q-separator v-if="menuItem.label === 'My account' && authService.user.value"/>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>


    <q-page-container :class="`q-pl-${$q.screen.gt.sm ? 'xl' : 'xs'} q-pr-${$q.screen.gt.sm ? 'xl' : 'xs'}`">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, provide } from 'vue'
import LoginDialog from '@/components/LoginDialog.vue';
import authService from "@/services/authService"; 
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import SearchBar from '@/components/SearchBar.vue';

export default {
  components: {
    LoginDialog,
    SearchBar
  },
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const rightDrawerOpen = ref(false);
    const loginVisible = ref(false);

    const toggleLogin = () => {
      if (!authService.user.value) {
        loginVisible.value = !loginVisible.value;
      } else {
        rightDrawerOpen.value = false;
        router.push("/My-account");
      }
    };
    provide('toggleLogin', toggleLogin);

    const logout = () => {
      authService.logout().then(() => {
        rightDrawerOpen.value = false;
        $q.notify({
          color: 'positive',
          position: 'top',
          message: 'You have been logged out'
        }); 
      });
    };
    console.log(authService.user);
    // Initialize the menu list
    const menuList = ref([
      { label: 'Home', icon: 'home', separator: false, to: '/' },
      { label: 'My account', icon: 'account_circle', separator: false },
      // Services section
      { label: "Find a room to rent", icon: "search", separator: false, to: "/" },
      { label: "Add a room for rent", icon: "add", separator: true, to: "/add-room" },
      // Help section
      { label: "Help", icon: "help", separator: false, to: "/help" },
      { label: "Contact", icon: "mail", separator: false, to: "/contact" }
    ])

    function toggleRightDrawer() {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }

    return {
      rightDrawerOpen,
      toggleRightDrawer,
      menuList,
      loginVisible,
      toggleLogin,
      logout,
      authService,
    }
  }
}
</script>