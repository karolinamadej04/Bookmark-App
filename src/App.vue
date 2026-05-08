<script setup>
import { RouterView } from 'vue-router'
import Sidebar from './views/Sidebar.vue';
</script>

<template>
  <Sidebar />
  <RouterView />
</template>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>