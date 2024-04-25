<!-- Modal.vue -->
<template>
    <transition name="modal">
      <div class="modal-mask" v-show="show" @click="close">
        <div class="modal-container" @click.stop>
          <slot></slot>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    props: ['show'],
    methods: {
      close() {
        this.$emit('update:show', false);
      }
    }
  };
  </script>
  
  <style src="C:\Users\$\g-09-gpteam\src\assets\css\Component.css"></style>
  
  