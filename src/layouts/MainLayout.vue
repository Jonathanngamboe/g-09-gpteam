<template>
  <q-layout view="hHh LpR fff">
    <q-header bordered class="bg-white text-primary" :class="`q-pl-${$q.screen.gt.sm ? 'xl' : 'xs'} q-pr-${$q.screen.gt.sm ? 'xl' : 'xs'}`">
      <q-toolbar class="q-gutter-sm">
        <!-- Logo -->
        <q-toolbar-title>
          <img src="~@/assets/logo-vue.png" style="height: 30px" />
        </q-toolbar-title>
        
        <!-- Search bar -->
        <!-- TODO: Implement search bar -->

        <!-- Avatar icon (Only visible on large screens) -->
        <q-btn flat round dense icon="account_circle" v-show="$q.screen.gt.md" />
        
        <!-- Menu icon (Only visible on small screens) -->
        <q-btn v-show="$q.screen.lt.md" dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>
    
    <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered>
      <!-- drawer content -->
      <q-scroll-area class="fit">
          <q-list  class="q-ma-md">

            <template v-for="(menuItem, index) in menuList" :key="index">
              <q-item clickable :active="menuItem.label === 'Outbox'" v-ripple>
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" class="text-primary"/>
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

export default {
  setup () {
    const rightDrawerOpen = ref(false)

    // Initialize the menu list
    // TODO: Replace with actual menu items
    const menuList = ref([
      { label: 'Home', icon: 'home', separator: false },
      { label: 'Profile', icon: 'account_circle', separator: true },
      // Services
      { label: 'Find a room to rent', icon: 'search', separator: false },
      { label: 'Put a room for rent', icon: 'add', separator: true },
      // Help section
      { label: 'Help', icon: 'help', separator: false },
      { label: 'Contact', icon: 'mail', separator: false },
    ]);

    function toggleRightDrawer () {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }

    return {
      rightDrawerOpen,
      toggleRightDrawer,
      menuList 
    }
  }
}
</script>

