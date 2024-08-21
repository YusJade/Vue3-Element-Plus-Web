<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import HomeView from './views/Home.vue'
</script>
<template>
  <RouterView />
</template>

<style>
@import './assets/font/font.css';

#app {
  font-family: "Source Code Pro", "思源宋体";
  font-weight: bold;
}

button {
  font-family: "Source Code Pro", "思源宋体";
}
</style>
