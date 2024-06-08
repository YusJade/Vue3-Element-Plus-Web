<template>
  <div :class="containerClasses">
    <img :src="avatarSrc" alt="User Avatar" class="w-20 h-20 rounded-full mx-auto mb-4" crossorigin="anonymous">
    <h2 class="text-lg font-semibold text-center" :class="nameClasses">{{ name }}</h2>
    <p class="text-sm text-center" :class="roleClasses">{{ role }}</p>
    <ul class="mt-4">
      <li class="flex items-center justify-center" :class="textClasses">
        <img :src="iconSrc" alt="check" class="w-4 h-4 mr-2">
        {{ text }}
      </li>
      <!-- <InfoListItem iconSrc="https://placehold.co/24x24" text="Los Angeles, CA" />
      <InfoListItem iconSrc="https://placehold.co/24x24" text="john.doe@example.com" />
      <InfoListItem iconSrc="https://placehold.co/24x24" text="(123) 456-7890" /> -->
    </ul>
    <button class="edit-button" aria-label="Edit">
      <img src="https://placehold.co/24x24" alt="edit" class="w-4 h-4">
    </button>
  </div>
</template>

<script>
import InfoListItem from './InfoListItem.vue';

const containerClasses = "bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg shadow-md max-w-md mx-auto mt-8 relative";
const nameClasses = "text-zinc-800 dark:text-zinc-200";
const roleClasses = "text-zinc-600 dark:text-zinc-400";

interface RoleInfoItem {
  iconSrc: string,
  desc: string
}

interface RolePanelInfo {
  avatarSrc: string,
  items: Array<RoleInfoItem>
}



</script>

<style scoped>
.edit-button {
  @apply bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-full w-10 h-10 flex items-center justify-center absolute bottom-4 right-4 shadow-md;
}
</style>
