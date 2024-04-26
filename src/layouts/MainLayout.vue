<template>
  <q-layout view="hHh LpR fff">
    <q-header bordered class="bg-white text-primary"
      :class="`q-pl-${$q.screen.gt.sm ? 'xl' : 'xs'} q-pr-${$q.screen.gt.sm ? 'xl' : 'xs'}`">
      <q-toolbar class="q-gutter-sm">
        <!-- Logo -->
        <q-toolbar-title>
          <router-link to="/">
            <img src="@/assets/logo-vue.png" alt="Logo" style="height: 30px" />
          </router-link>
        </q-toolbar-title>

        <!-- Search bar -->
        <!-- TODO: Implement search bar -->
        <q-btn unelevated outline label="Login" @click="toggleLogin" icon="login" />
        <LoginDialog :isVisible="loginVisible" @update:isVisible="val => loginVisible = val"
          @close="loginVisible = false" />
        <!-- Avatar icon (Only visible on large screens) -->
        <q-btn-dropdown flat round dense icon="account_circle" v-show="$q.screen.gt.md" dropdown-icon="menu">
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <template v-for="(menuItem, index) in menuList" :key="index">
                <div v-if="menuItem.label !== 'My Profile'">
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

            <div class="column items-center">
              <q-avatar size="48px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

              <!-- Display the login and sign up buttons in column with a gap between them -->
              <div class="q-pa-md flex flex-center">
                <div class="column q-gutter-y-sm">
                  <q-btn
                    rounded
                    unelevated
                    color="primary"
                    label="Login"
                    push
                    size="sm"
                    v-close-popup
                    to="/login"
                  />
                  <q-btn
                    rounded
                    unelevated
                    color="primary"
                    label="Sign Up"
                    push
                    size="sm"
                    v-close-popup
                    to="/signup"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-btn-dropdown>

        <!-- Menu icon (Only visible on small and medium screens) -->
        <q-btn flat round dense icon="menu" v-show="$q.screen.lt.lg" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered>
      <!-- drawer content -->
      <q-scroll-area class="fit">
        <q-list class="q-ma-md">

          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable :to="menuItem.to" :active="menuItem.label === 'Outbox'" v-ripple>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" class="text-primary" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
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
import { ref } from 'vue'
//import LoginDialog from '@/components/LoginDialog.vue';
import LoginDialog from '../components/LoginDialog.vue';

export default {
  components: {
    LoginDialog
  },
  setup() {
    const rightDrawerOpen = ref(false);
    const loginVisible = ref(false);
    const toggleLogin = () => {
      console.log(loginVisible.value);
      loginVisible.value = !loginVisible.value;
    };
    // Initialize the menu list
    // TODO: Replace with actual menu items
    const menuList = ref([
      { label: 'Home', icon: 'home', separator: false, to: '/' },
      { label: 'My Profile', icon: 'account_circle', separator: true, to: '/profile' },
      // Services section
      { label: 'Find a room to rent', icon: 'search', separator: false, to: '/find-room' },
      { label: 'Add a room for rent', icon: 'add', separator: true, to: '/add-room' },
      // Help section
      { label: 'Help', icon: 'help', separator: false, to: '/help' },
      { label: 'Contact', icon: 'mail', separator: false, to: '/contact' },
    ]);

    function toggleRightDrawer() {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }

    return {
      rightDrawerOpen,
      toggleRightDrawer,
      menuList,
      loginVisible,
      toggleLogin,
    }
  }
}
</script>
