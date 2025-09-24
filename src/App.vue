<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" :key="$router.path" />
  </router-view>
  <consult />
</template>
