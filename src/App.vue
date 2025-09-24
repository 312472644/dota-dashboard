<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$router.path" />
    </keep-alive>
  </router-view>
  <consult />
</template>
